# TOOL-7 — the silent-failure-idiom lint, MEASURED

Lane: Opus RECON (read-only). Chair: Fable 5.1, session a9df403c. Stamped 2026-09-20 04:15 EDT
(`date` read in the same call as the tree check).

**TREE.** `$SP/read-tip-63e40fe57`, HEAD `63e40fe5708c1459fe303442c38e66fa8e9b388b`,
`git status --short` EMPTY at start (04:03) and at end (04:15). Nothing edited, staged,
committed or run as a gate. Every artefact under `$SP/lane-tool-7-scratch/`.

---

## ⛔ 0. THE TIP IS ONE COMMIT BEHIND CURE-E/F/G — READ THIS FIRST

**CONFIRMED.** The assigned read tip does **not** contain the cures the brief describes as landed:

```
$ git merge-base --is-ancestor 9f3455b842 HEAD   # CURE-E
9f3455b842 is NOT an ancestor of HEAD
96036427f1 is NOT an ancestor of HEAD            # CURE-F
c71782e7f4 is NOT an ancestor of HEAD            # CURE-G
$ git log --oneline 63e40fe57..9f3455b842
9f3455b84 CURE-E: the trade-route token pin reads its producer's DECLARATION, not a second marker …
```

`63e40fe57`'s own log carries CURE-A … CURE-D only. So every count below is a **pre-CURE-E**
population, and the two instances CURE-E cured are still present in what I measured:
`tests/domain/humanizeEngineTokens.test.js:151` and `tests/components/faithPanelModel.test.js:217-218`.

**Delta to apply for the live branch tip:** subtract 2 from arm B's band-C count and 3 from its
B1 count (humanize ×1, faithPanel ×2); CURE-E's replacements are the band-A found-and-ordered
form. Arm A and arm C are untouched by CURE-E/F/G (`git show --stat 9f3455b842` names only
those two test files). Nothing else in this report moves.

---

## 1. THE TWO PRIMITIVES, EXECUTED (receipts, not reasoning)

Plain `node v24.12.0`, no gate. Output verbatim:

```
--- ARM A primitive ---
constructor            in FROZEN literal => true | value typeof => function
toString               in FROZEN literal => true | value typeof => function
valueOf                in FROZEN literal => true | value typeof => function
hasOwnProperty         in FROZEN literal => true | value typeof => function
__proto__              in FROZEN literal => true | value typeof => object
isPrototypeOf          in FROZEN literal => true | value typeof => function
propertyIsEnumerable   in FROZEN literal => true | value typeof => function
toLocaleString         in FROZEN literal => true | value typeof => function
Object.isFrozen => true
Object.hasOwn(TIER_INDEX, "constructor") => false
Object.fromEntries obj: "toString" in it => true | typeof => function
fromEntries["toString"] += 1 => ["a","toString"] own toString = function toString() { [native code] }1

--- ARM B primitive ---
ordered  : "<start>BBBB"
INVERTED : ""                        <- silent empty, no throw
MISSING END (indexOf=-1): "<start>BBBB<end>CCC"  <- over-capture minus last char, no throw
MISSING START: ""                    <- silent
slice(0, indexOf(missing)) => "AAAA<start>BBBB<end>CCC"  <- drops LAST CHAR silently
slice(indexOf(missing))    => "C"    <- returns LAST CHAR silently
```

`Object.freeze` does **not** close the prototype door, and `Object.hasOwn` is the exact cure.
`String.prototype.slice` is silent in **four** distinct ways, not two.

---

## 2. ARM A — `x in <object literal>`

Instrument: `scanA2.mjs`. Strip = the estate's own `tests/helpers/codeOnlySource.js`
**plus a regex-literal blanker I had to add** (see §5, false-positive class 2).
Scope `src/` + `tests/` + `scripts/`, 5,141 files.

### 2.1 The funnel (CONFIRMED)

| stage | count |
|---|---|
| `\bin\b` tokens after comment + string + regex strip | 842 |
| `for…in` (excluded by syntax) | 7 (all in `tests/`) |
| non-operand LHS — regex/keyword residue (excluded) | 452 |
| RHS not an identifier (excluded) | 42 |
| **membership-test `in` operators** | **341** |
| — RHS resolves to an object literal (frozen or plain), **convictable** | **96** |
| — RHS unresolvable (parameter / global / member chain) | 189 |
| — RHS an other-expression | 50 |
| — RHS a function / array (false positive) | 3 |
| — RHS a Map / Set / class instance | **0** — the estate uses `.has()` |
| `Object.hasOwn(` occurrences already in the tree (the safe form) | 178 |
| `hasOwnProperty` occurrences | 352 |

**96 convictable**, split by failure direction:

| direction | count | what goes wrong |
|---|---:|---|
| `!(x in LIT)` — absence check | 63 | a prototype key reads as **PRESENT**, so the item is silently exempted / never reported. In a test this is a **false green**. |
| `(x in LIT)` then `LIT[x]` — guard-then-read | 31 | the guard passes and `LIT[x]` yields a **function** (or `object` for `__proto__`), handed downstream as a value. |

Guard-then-read by tree: **src 11 · tests 17 · scripts 3**.

### 2.2 The convictable `src/` instances — runtime risk, every one listed

| file:line | expression | risk | verdict |
|---|---|---|---|
| `src/domain/traditions/genesis.js:143` | `if (raw && raw in TIER_INDEX) return { tier: raw, tierIndex: TIER_INDEX[raw] }` | `raw = settlement.tier`, a **saved-campaign string**. `tier:'constructor'` ⇒ guard passes, `tierIndex` becomes the `Object` **constructor function**; downstream arithmetic ⇒ `NaN`. | **CONVICT — highest src risk** |
| `src/domain/traditions/politics.js:99` | `if (raw && raw in TIER_INDEX) return TIER_INDEX[raw]` | identical shape; the file's own comment says it "mirrors genesis.resolveTierBand exactly". **A two-instance copied family.** | **CONVICT** |
| `src/domain/worldPulse/commercialReasonTaxonomy.js:138` | `if (key in COMMERCIAL_REASON_MIRRORS) return COMMERCIAL_REASON_MIRRORS[key]` | `key = String(type)`, `type` typed `unknown`. JSDoc promises `string \| null` and "Total on both sides by construction" — **the declared contract is false** for prototype keys. The next line `REVERSE_MIRRORS[key] ?? null` has the **same** bug (`??` does not catch a function). **Two leaks in three lines.** | **CONVICT** |
| `src/lib/flagRegistry.js:177` | `if (!(name in FLAG_DEFAULTS)) { warn; return false }` … `?? FLAG_DEFAULTS[name]` | `flag('constructor')` skips the unknown-flag warning and returns the `Object` constructor — **truthy**, so the flag reads ON. The fallback chain reads **URL params and localStorage** first. Call sites are literals today, so reachability is low; the exported surface is not bounded. | **CONVICT** |
| `src/lib/pulseFingerprint.js:160` | `if (t && t in familyCounts) familyCounts[t] += 1` | `familyCounts` is `Object.fromEntries(...)` — plain object, has a prototype. `t` is an engine token off a pulse result. Executed above: `o['toString'] += 1` mints an own key holding `"function toString() { [native code] }1"`, which then travels in a **fingerprint/telemetry payload**. | **CONVICT** |
| `src/domain/worldPulse/espionage/espionageDoctrine.js:170` | `if (!(natureWord in TARGETING_BY_NATURE)) return unknownDoctrine(…)` | `natureWord = String(row.natureWord ?? '')`. Producer (`natureWordFor`) is bounded per the file's own comment, so unreachable today; the resolution gate is the only place `unknown` is minted, so a bypass is silent. | CONVICT (medium) |
| `src/components/admin/AdminTrendsCharts.jsx:108` | `s.points.filter((p) => p.x in idx)` then `idx[p.x]` | bucket labels; a prototype name would make `xAt(function)` ⇒ `NaN` coordinate ⇒ broken SVG path. | CONVICT (low) |
| `src/lib/constructionUsage.js:112,113` | `if (a in deg) deg[a] += 1` | node ids into a locally seeded `{}`; a prototype-named id corrupts the degree count. | CONVICT (low) |
| `src/domain/spatial/commodityFlow.js:500,505` · `src/domain/worldPulse/generosityKernel.js:1041,1094,1121` · `routeNetworkLedger.js:554` · `traditionsKernel.js:448` | `if (k in writes) continue;` accumulator "already written?" guards | a prototype-named key makes the guard say **already written** and **skips the write** — the same shape as the EM-B1k data-loss family (a write that ghosts). Key spellings carry separators today, so low probability, non-zero blast radius. | CONVICT (low), **family** |
| `src/domain/worldPulse/beliefMap.js:1127` · `disinformationPlant.js:162` | `if (!(GOVERNING_SEAT_KEY in nextObserver))` | LHS is an **internal constant**. | **NOT convictable** — false-positive class 8 |
| `src/domain/worldPulse/espionage/espionageProducts.js:311` | `if (!(mapping.slot in slots))` | `mapping` comes from the frozen internal `LEG_SLOTS`. | **NOT convictable** — false-positive class 8 |

**src verdict: 9 convictions across 15 sites, 2 sites excluded.** Two of the nine
(`genesis.js` / `politics.js`) are the same defect copied — a structural-prevention trigger.

⭐ **The estate has already convicted and cured this class once and left the habitat standing.**
`tests/lint/vocabularyTotality.walker.test.js:408-415` carries, in its own words, the
`complexityBandOf` incident: *"a `?? null` read returned the CONSTRUCTOR FUNCTION for
'constructor'/'toString'/'valueOf'/'hasOwnProperty' — a function handed to a React child …
fixed by hasOwn"*, with four executed pins. One site cured, `Object.hasOwn` adopted 178 times,
and 96 `in`-on-a-literal sites still live. That is the habitat argument for TOOL-7, made by
the estate's own record.

### 2.3 The convictable `tests/` instances — vacuous-green risk

**79 sites** (52 frozen-literal, 25 plain, 2 `fromEntries`). Overwhelmingly the
`!(x in EXEMPT_TABLE)` / `!(x in REGISTRY)` shape over exemption and registry tables:
`contractTestAntiVacuity.walker.test.js:357,369,382` (all three of its own rule gates!),
`serviceCategoryRegistration.walker.test.js:942,971,989,1020`,
`mechanismLitCoverage.test.js:266,269,298,382`, `aiSurfaceSourceScan.test.js:119,158,180`,
`committedSecretsScan.test.js:96`, `oathStampTotality.walker.test.js:214` ×2,
`heraldRouting.walker.test.js:254,295`, `migrationSearchPathPin.test.js:221,233`,
`ruinFilterRoster.walker.test.js:307,336`, `deployRunbookFreshness.test.js:500,516`,
`domainAnyCastBaseline.test.js:412,558`, `spatialLedgerCoverage.walker.test.js:204,237`,
`phoneChromeFloor.census.test.js:351,425`, `stepMetadataSync.test.js:35,53`,
`institutionVocabulary.test.js:80,149`, `impactKindWalkers.test.js:234,240`,
`styleShorthandLonghand.walker.test.js:210,226`, `verifyJwtPins.test.js:82`,
`savesColumnParity.test.js:125`, `townMapMassingSilhouette.walker.test.js:39`,
`districtProfile.test.js:245`, `demographicsRates.test.js:715,867`,
`realmCoverage.walker.test.js:92`, `voiceMechanics.test.js:1043`,
`enforcement-claims.test.js:78`, `exportTokenCoverage.test.js:246`,
`engineGatedRuleKeys.walker.test.js:1024`, `facetInferenceHonesty.walker.test.js:364`,
`siteCoherenceRatchet.test.js:324`, `swatchResolves.test.js:56`,
`shippedAssetLicence.test.js:192`, `aiSurfaceCensus.js:161`, `organicInk.test.js:44,76`,
`boundBookSubstrate.test.js:164`, `institutionProfile.test.js:53`,
`modelRegistryAgreement.test.js:143,494`, `tuningBatchE2.test.js:95`,
`mutationOrder.test.js:50`, `baseStateCapsule.test.js:73`, `interview`-adjacent rows.
(Full machine list: `A2.raw.txt`, lines under `--- ROWS ---`.)

**Severity read:** for a walker whose keys are **file paths** or **snake_case engine tokens**,
a prototype collision is not reachable — a path contains `/`, a token is `stressor_birth_*`.
The reachable subset is where the key is a **free-form name**: institution names, display
names, service names, flag keys. My read is that **no live vacuous green exists today**; the
conviction is habitat, not instance. I did **not** execute any suite to confirm this
(no-gate), so: **PLAUSIBLE**, not CONFIRMED.

---

## 3. ARM B — the marker-slice source scan

Instrument: `scanB2.mjs`. Scope as arm A.

### 3.1 The crisp predicate (the finding that prices this arm)

`.slice(` total in tree: **2,427**. `.substring(` / `.substr(`: **0** — the estate does not use
them, so a `substring` arm is **dead on arrival** and should not be built.

Of the 2,427, **113 carry a `indexOf` / `lastIndexOf` / `search` call *inline inside the slice
arguments***. That inline form is the whole class and it is **unassertable by construction**:
there is no name bound to the index, so nothing exists to assert `>= 0` or `< to` about. CURE-E's
cured form necessarily binds `from`/`to` first. **The lint's arm B rule is therefore
false-positive-free on its own question: convict any `slice` whose argument expression contains a
finder call.** No heuristics, no window scanning, no context guessing.

### 3.2 Population by shape (CONFIRMED)

| shape | n | silent failure mode |
|---|---:|---|
| **B1** two **distinct** inline anchors | **20** | inverted ⇒ `''`; missing end ⇒ over-capture to EOF − 1 char. **CURE-E's exact class.** |
| **B2** same anchor + numeric offset | 6 | missing anchor ⇒ window at `len-1` |
| **B3** `slice(indexOf(a))` / start-only | 49 | missing anchor ⇒ returns the **last character** |
| **B4** `slice(0, indexOf(a))` | 38 | missing anchor ⇒ **drops the last character**, near-invisible |
| by tree | tests **99** · scripts **13** · src **1** | |
| with a separate anchor-presence assertion anywhere in the file | **32 of 113** | |

⚠ **B1 is ≥21, not exactly 20.** `tests/domain/peaceTermsGrantTerms.test.js:510` is a genuine
two-anchor span (`'faith: Object.freeze('` → `'population: Object.freeze('`) that my argument
splitter mis-parsed into B3, because the anchor **literal itself contains a paren**. Stated as a
known instrument limit rather than hidden — and it is itself a lesson for the lint (§5, class 9).

### 3.3 Every B1 instance (the marker-slice class proper)

| file:line | anchors | anchor asserted elsewhere? |
|---|---|---|
| `tests/domain/humanizeEngineTokens.test.js:151` | `const TERRAIN_ROUTE_POOLS` → `export const CULTURES` | NO — **the bug CURE-E cured** |
| `tests/components/faithPanelModel.test.js:217` | `### DS-FTH-1` → `### DS-FTH-2` | NO — cured by CURE-E |
| `tests/components/faithPanelModel.test.js:218` | `"DS-FTH-1"` → `"DS-FTH-2"` | NO — cured by CURE-E |
| `tests/edgeFunctions/surveyorByok.test.js:50` | `if (action === 'probe'` → `// ── the verify-by-test-call` | NO |
| `tests/edgeFunctions/surveyorByok.test.js:138` | `const consumeRate =` → `const firstRate =` | NO |
| `tests/edgeFunctions/surveyorByok.test.js:165` | `rpc('surveyor_usage_precheck'` → `runCreditedCall(` | NO |
| `tests/edgeFunctions/surveyorByok.test.js:174` | same pair, second test | NO |
| `tests/edgeFunctions/surveyorByok.test.js:633` | `const probeRefusal` → `const deadline` | NO |
| `tests/edgeFunctions/aiProviderAbstraction.test.js:234` | `async function fetchAiWithRetry` → `async function runWithConcurrency` | NO |
| `tests/edgeFunctions/aiProviderAbstraction.test.js:286` | `RECONCILE the pre-run reservation` → `rpc('release_ai_spend_reservation'` | NO |
| `tests/security/byokNeverLogged.test.js:89` | `create table` → `);` | NO — **a security pin** |
| `tests/ui/uiA11yWave5.test.jsx:189` | `aria-labelledby="purchase-modal-title"` → `{/* Header */}` | NO |
| `tests/domain/aiAnalyst.test.js:461` | `§3f THE ENRICHMENT RIDER` → `map the outcome to a response` | NO — **prose anchors, the most movable kind** |
| `tests/domain/razingWitnessWr8.test.js:439` | `export function razingWitnessPatch` → `export function razingSiegeEmission` | NO |
| `tests/domain/simulationRulesPreset.stability.test.js:637` | `export function ensureWorldStateWithEnvoyNormalizer` → `export function createNewCampaignWorldState` | NO |
| `tests/domain/peaceTermsGrantTerms.test.js:510` | `faith: Object.freeze(` → `population: Object.freeze(` | NO |
| `tests/store/autoplacementStore.test.js:101` | `applyAutoplacement:` → `// RETIRED (R-5b` | NO — **a comment as an anchor** |
| `tests/components/arrowHeader.test.jsx:235` | `<nav` → `</nav>` | yes (:237) |
| `tests/domain/interview.test.js:172` | `open` (var) → `<<<END_INTERVIEW_PRIOR_EXCHANGE>>>` | yes |
| `tests/lint/postureNameCollision.walker.test.js:246` | `### SP-C — THE POSTURE READ` → `### SP-D — ` | yes |
| `scripts/check-observed-shape-readers.mjs:2090` | `DEFAULT_SIMULATION_RULES` → `ENGINE_GATED_VIRTUAL_RULE_KEYS` | yes |

**Sharpest-risk reads, by anchor movability** (PLAUSIBLE — no suite executed):
`aiAnalyst.test.js:461` (two **prose** anchors inside a doc — the exact fragility EM-P3 exercised),
`autoplacementStore.test.js:101` (the end anchor is a **retirement comment**; a tidy-up deletes it
and the span silently runs to EOF), `byokNeverLogged.test.js:89` (a **security** pin whose end
anchor `');'` is the most common two characters in SQL), and the five
`surveyorByok.test.js` spans (paid-surface BYOK governance, anchored on
declaration text that any rename moves).

The **one `src/` instance**: `src/domain/worldPulse/beliefAxes.js:199` —
`ref.slice('migration.'.length, ref.lastIndexOf('.'))`. Token parsing on a known shape;
a `ref` with no dot silently yields a truncated id. Low risk, same class, listed for totality.

### 3.4 ⭐ THE FINDING THAT REPRICES ARM B

**`tests/helpers/sourceContract.js` already exists and is exactly this cure**, with a header
that names this exact class:

> *"THE CLASS THIS CLOSES ('tests that lie') … the SILENT extractor: a helper that returns `''`
> … after which the test's assertion runs against emptiness and PASSES vacuously … Every
> source-extraction a contract test needs routes through these functions, and every one of them
> THROWS (never returns '') when its target is absent."*

It exports `mustExtract`, `functionBody`, `sqlFunctionBody`, `jsRegexTokens`,
`sqlRegexAlternation`, `statementWindowAt`, `sinkStatementOffenders`, `sinkLineOffendersBlind`,
and it already has an enforcing walker — `tests/lint/contractTestAntiVacuity.walker.test.js`,
whose **Rule 1b** exists to keep tests on it.

**Why the class escaped anyway, in the walker's own words** (line 38-39, its declared ACCEPTED GAP):

> *"Rule 1b keys on extractor-NAME heuristics; a silent extractor with an unconventional name is
> uncaught (prefer sourceContract, which throws)."*

An inline `src.slice(src.indexOf(a), src.indexOf(b))` has **no callee name at all**, so
`EXTRACTOR_CALLEE_RE` cannot see it. **Arm B is not a new walker. It is Rule 5 of
`contractTestAntiVacuity.walker.test.js`, closing that file's own declared gap.**

⛔ **And the scope is the crux.** Measured red count by the walker's existing scopes:

| scope | all 113 | B1 only |
|---|---:|---:|
| `inScope` (tests/security, `*.contract.test.*`, tests/lint) | **24** | **2** |
| `inFoldScope` (+ tests/edgeFunctions, tests/build, tests/lib) | **44** | **9** |
| whole tree | **113** | **≥21** |

**Both of CURE-E's own instances (`tests/domain/`, `tests/components/`) fall outside
`inFoldScope`.** A Rule 5 confined to the existing scopes **would not have caught the bug that
motivated it** — which is precisely the failure the same file's header forbids at lines 78-80:
*"A prevention rule that cannot see the directories where its own class has actually occurred is
vacuity one level up."* Rule 5 must be given `tests/**` + `scripts/**`.

---

## 4. ARM C — the two idioms the lanes named

### C1 — naive brace matchers

**97 comparison sites across 36 files.** Measured by file-level proxy (does the file contain any
`codeOnly` / `stripComments` / `blankComments`): **24 of 36 files have NO strip at all**, 12 do.

⚠ **The proxy over-credits.** `tests/lint/vocabularyTotality.walker.test.js` counts as "STRIP"
only because it defines a local `stripComments` for a *different* arm — its `fnBody` (:75) and
`objectLiteralKeys` (:88) brace matchers run on **raw source**, and `fnBody`'s own comment
declares the assumption: *"(these targets carry no braces in strings)"*. So the honest floor is
**≥25 of 36 files naive**, and the true count needs a per-matcher data-flow read the proxy
cannot do.

Naive matchers with the widest blast radius: `tests/helpers/sourceContract.js:245`
(`statementWindowAt` — **the estate's own fail-closed chokepoint brace-counts raw text**),
`tests/helpers/couplingReceiptSample.js:38`, `tests/lint/dossierMountRegistry.walker.test.js`
(4 naive matchers at :877, :1449, :1462, :1487), `scripts/count-domain-any.mjs:131`,
`scripts/soak/tripwires.mjs:793`, `scripts/edgeEnvScopeGuard.mjs:100`,
`tests/lib/savesColumnParity.test.js:72`, `tests/domain/pulseStageContracts.test.js:181`,
`tests/security/aiSurfaceSourceScan.test.js`, `tests/security/mapForkXssChain.test.js`.

**Verdict: a real population (≥25 files), but NOT an arm.** A lint cannot decide from syntax
whether the string a matcher iterates was already stripped — that needs data-flow. The right
instrument is **an adoption ratchet**, not a detector: a shrink-only inventory of brace-matcher
sites that do not receive a `codeOnly`-derived string, in the `shrinkOnlyBaseline.js` idiom the
estate already has (`tests/helpers/shrinkOnlyBaseline.js`).

### C2 — hard-coded console labels in closure probes

**No population. Do not build this arm.**

`console.*` calls whose first argument is an uppercase string literal, tree-wide: **5**, all
five with **distinct** labels, none matched anywhere else in the tree:

```
1  "FAILED:"          scripts/deep-profile-generations.mjs:201
1  "FINAL STATE:"     scripts/observe-genesis-war-ramp.mjs:155
1  "GENERATE ERROR:"  src/components/GenerateWizard.jsx:234
1  "SIM FAILED:"      scripts/simulate-generations.mjs:380
1  "WROTE"            scripts/probe-ej-family2.mjs:178
```

EM-B1f's bite was a **one-off in a throwaway probe**, not a habitat. Recommend **CLOSED — no
population** (with the reason recorded, per the no-deferred-work law).

---

## 5. THE FALSE-POSITIVE CLASSES A LINT MUST EXCLUDE

Numbered so the lint lane can cite them.

1. **`for…in`** — 7 sites. Excluded by syntax; free in an AST rule, one regex in a walker.
2. ⛔ **Regex literals.** `tests/helpers/codeOnlySource.js` blanks comments, strings and template
   text but **does NOT blank regex literals**. Measured: adding a regex blanker moved arm A's raw
   token count 944 → 842 and killed 452 non-operand matches (`/Test timed out in \d+ms/`,
   `/ease(?:-in|-out)/`, …). **A walker that reuses `codeOnly` alone for arm A produces
   hundreds of false positives.** `contractTestAntiVacuity.walker.test.js`'s own
   `codeSkeleton` (:127) *does* blank regexes and carries the `'>'`-after-arrow fix at :152 —
   that is the correct strip to reuse, not `codeOnly`.
3. **Unresolvable RHS** — 189 of 341 membership tests (55%) have a parameter, global, or member
   chain on the right. A source scan cannot tell whether those are literals. Convicting them is
   noise; skipping them is a **55% blind spot that must be declared**, chooser-totality style.
4. **Map / Set / class instances** — 0 found. The estate uses `.has()`. Cheap to keep as a rule,
   zero cost today.
5. **`Object.hasOwn` / `hasOwnProperty` already** — 178 + 352 occurrences. Already-cured form;
   not `in`, so never matched. No exclusion needed, but it is the **cure vocabulary** a message
   should name.
6. **Array RHS** (`i in arr`) — 1 site. Different semantics (index presence); exclude.
7. **Function RHS** — 2 sites. Exclude.
8. ⛔ **LHS bounded by an internal frozen table** — `espionageProducts.js:311`,
   `beliefMap.js:1127`, `disinformationPlant.js:162`. The key comes from a constant or a frozen
   internal map, so no untrusted string can reach it. **Not computable from syntax** — needs a
   declared exemption register with written reasons (the `RELATIONSHIP_ADMISSION_SETS` idiom).
9. **Anchor literals containing parens/brackets** — arm B's argument splitter mis-parsed
   `peaceTermsGrantTerms.test.js:510` for this reason. A balanced-paren splitter must run on the
   **stripped** source (parens inside string literals are not structure). My own instrument got
   this wrong once; the shipped one must not.
10. **Test-fixture strings that intentionally demonstrate the bad form** — every estate walker
    with adversarial self-tests plants its own bad shape. Excluded by the strip + the
    `SELF`-exclusion idiom (`contractTestAntiVacuity.walker.test.js:55, 65`).

---

## 6. THE LINT, PRICED

### 6.1 Wall-clock (CONFIRMED, `timewalk.mjs`, read + `codeOnly` + both arm regexes)

```
antiVacuity narrow-ish scope         325 files    6.5 MiB    184 ms
tests/ only                         2707 files   33.0 MiB    981 ms
src/ only                           2246 files   32.0 MiB    901 ms
src+tests+scripts (full arm A+B)    5140 files   68.5 MiB   1960 ms
full, second pass (warm cache)      5140 files   68.5 MiB   1952 ms
```

**~2.0 s for the full tree, ~1.0 s for `tests/` alone.** Add ~1.3 s if arm A resolves imports and
exports (my `scanA2.mjs` ran 3.3 s wall with resolution). Comfortably inside a suite; no cache
needed. Second pass identical — no warm-cache cliff.

### 6.2 Arms — what I recommend building, and where

| arm | instrument | home | red at this tip |
|---|---|---|---|
| **A** | ESLint `no-restricted-syntax`, selector `BinaryExpression[operator='in']` | `eslint.config.js` | 341 (all membership tests) or 96 with a resolution pass |
| **B** | **Rule 5** of the existing anti-vacuity walker | `tests/lint/contractTestAntiVacuity.walker.test.js` | 113 tree-wide · 44 foldScope · 24 inScope |
| **C1** | shrink-only adoption baseline, not a detector | `tests/lint/` + `.brace-matcher-baseline.json` | ≥25 files |
| **C2** | — | — | **CLOSED, no population** |

**Why arm A wants ESLint, not a walker.** An AST selector has **zero** false positives from
classes 1, 2, 9 and 10 — it cannot match inside a string, a comment or a regex, and it
distinguishes `ForInStatement` from `BinaryExpression` for free. A regex walker must re-solve all
four. `npm run lint` is already `eslint src/ tests/ scripts/`, so the coverage is free.

⛔ **The ESLint hazard, and it is documented in the config itself** (`eslint.config.js:441-442):
*"flat config is last-wins per rule, so each file must be covered by exactly ONE
no-restricted-syntax block."* There are **10 existing `no-restricted-syntax` blocks**
(lines 244, 306, 345, 373, 452, 497, 537, 593, 804 …). The tree-wide block at :132 has **none**
(CONFIRMED), and the `tests/**` (:884) and `scripts/**` (:895) blocks have **none** — so those
three can take a new selector cleanly. But `src/generators/**`, `src/pdf/**`, `src/domain/**`,
`src/workers/**`, `src/kernel/**`, `src/lib/instantWorld/**`, `src/components/**` each already
own one, and an `in`-operator selector must be **merged into each**, not added beside it.
That is ~7 edits to a 58 KB config, each of which silently disables the other selectors if done
wrong. **This is the single largest cost in the whole lint and the chair should price it before
chartering.**

**Why arm B wants Rule 5, not a new file.** It closes that walker's own declared gap; it inherits
`codeSkeleton` (the correct regex-aware strip), the empty-allowlist idiom, the adversarial
self-test idiom, the `SELF` exclusion, and the file's existing mutation row. A new
`tests/lint/*.walker.test.js` costs +1 file and +N titles at the lighting census; Rule 5 costs
titles only.

### 6.3 The red count and what happens to it

Arm B, if scoped as the class demands (`tests/**` + `scripts/**`): **113 reds**, of which
**≥21 are B1** (the genuine two-anchor spans, three already cured by CURE-E ⇒ **≥18 live**).

The estate's own precedent forbids landing this with an allowlist. The same walker's header:
*"The three older rules were landed against a TRIAGED population: every instance inside `inScope`
was fixed before they went in, which is why all three allowlists above are empty"*, and
*"NOTHING is exempted, because these three rules simply do not scan there yet. Triaging them is
its own act, and the fold does not get to smuggle it in."*

So the honest shape is a **two-act charter**:
- **Act 1** — cure the **≥18 live B1 sites** (they are mechanical: bind `from`/`to`, assert found,
  assert ordered — CURE-E's `spanBetween` verbatim, ~6 lines each), then land Rule 5 at B1 scope
  with an **empty** allowlist.
- **Act 2** — B2/B3/B4 (93 sites) as a separate wave, or as a shrink-only baseline if the chair
  judges the single-anchor forms lower-yield. My read: **B4 (`slice(0, indexOf(a))`, 38 sites,
  drops the last character silently) is the sneakiest of the three** and deserves Act 2; B3's
  "returns the last character" is loud enough that a downstream assertion usually catches it.

### 6.4 The mutation-coverage row's mutant (CONFIRMED)

`scripts/mutation-coverage-manifest.json` — 706 invariant rows, **172 under `tests/lint/`**.
Row kinds there: 50 `rationale`, 45 `mutation`, 22 `uncovered`, **12 `self-proving-meta`**.

The target walker **already holds the cheapest row**:
```
tests/lint/contractTestAntiVacuity.walker.test.js -> {"kind":"rationale","ref":"self-proving-meta"}
```
whose rationale reads: *"Guard-the-guard meta-test that injects its own broken fixtures … and
asserts the enforcer reds — the mutation proof is embedded in the test body and executes on
every suite run."*

**So Rule 5 costs NO new mutant and NO manifest row, provided it ships with adversarial
self-tests in the file's existing pattern** (`:427-526`): one test that the rule **fires** on a
planted inline-finder slice, one that it **clears** on the bound-and-asserted form, and one that
it **cannot be forged from a shape quoted inside a string or a comment** (the file already has
that third test at :514 — Rule 5 just joins it). That is the whole mutation price: **three
`it(` titles**, which move the lighting census by +3 and nothing else.

⚠ **Two register bills the lane must budget** beyond the census:
- `tests/lint/negativeAssertionAnchor.walker.test.js:670` holds an **exact-equality** per-file
  count of `.not.*` assertions lacking an `// anchored:` marker. Any `.not.` Rule 5 adds needs
  the marker **on the immediately preceding line** (CURE-E's commit records that a wrapped
  marker reads as un-anchored and moves the frozen row, which is an exact-equality red).
- `contractTestAntiVacuity.walker.test.js` is **inside its own `inScope`** and self-excludes via
  `SELF` — but it is **also one of arm A's 96 convictions** (`:357, :369, :382`, all three rule
  gates use `!(key in EXEMPT)`). If arm A lands first, the anti-vacuity walker reds itself.
  **Order matters: arm B before arm A, or cure those three lines in arm A's own lane.**

### 6.5 The shared helper — where `objectLiteralKeys` / `fnBody` belong

**CONFIRMED, and the answer is cheaper than the cure lane feared.**

`objectLiteralKeys` (:88) and `fnBody` (:75) are `export`ed from
`tests/lint/vocabularyTotality.walker.test.js` and have **ZERO importers today**:
```
$ grep -rn "vocabularyTotality" src tests scripts | grep -v "^tests/lint/vocabularyTotality"
  → 16 hits, all doc-comment citations + 1 negativeAssertionAnchor register row
     + 2 mutation-manifest rows. No import statement anywhere.
```
So extracting them costs **no importer re-registration and no lighting-census re-freeze today**.
The `export` keyword is a **loaded gun**: the first importer pays the bill
(`codeOnlySource.js`'s header records exactly that incident — *"importing a symbol from a
`.test.js` file RE-EVALUATES that module … a fence that imported it reports seven tests it does
not own"*). Extract now, free; extract after the lint imports it, expensive.

**The home: `tests/helpers/sourceContract.js`**, not a new file — because that file *is* the
estate's declared fail-closed extractor chokepoint, it already exports `functionBody` (a
near-duplicate of `fnBody`) and `statementWindowAt`, and `contractTestAntiVacuity` Rule 1b
already names its members in `EXTRACTOR_CALLEE_RE`. Adding `objectLiteralKeys` there makes
Rule 1b see it for free. The alternative — a new `tests/helpers/sourceDeclarations.js` beside
`codeOnlySource.js` — is defensible only if the chair wants the brace-matching family kept
separate from the throwing family.

⛔ **Two things the move must fix, not carry:**
1. `fnBody` and `objectLiteralKeys` **return / throw inconsistently** with their new neighbours.
   `sourceContract`'s whole contract is *"every one of them THROWS (never returns '')"*.
   `objectLiteralKeys` throws on a missing declaration — good — but its brace loop can fall
   through to `end = open` and return a slice of length 0 on unbalanced input, silently.
2. Both brace-match **raw source** (arm C1). Inside `sourceContract.js` that inconsistency
   becomes a contradiction of the file's own header.

**The duplication census that justifies the extraction** (CONFIRMED):
- `fnBody` defined **3×** — `vocabularyTotality.walker.test.js:75`,
  `tests/lib/saves.metaProjection.test.js:30`, `tests/lib/saves.galleryOptIns.test.js:33`
  (plus a *variable* named `fnBody` at `tests/security/foundersRoll.pglite.test.js:126`,
  itself an arm-B B4 site).
- `objectLiteralKeys` defined **2×** — `vocabularyTotality.walker.test.js:88`,
  `tests/store/savedSettlementPatchKeysWalker.test.js:168` (different signature).
- `declarationBody` — a **third** spelling, minted by CURE-E inside
  `humanizeEngineTokens.test.js` rather than shared.

That is **six hand-rolled brace matchers for two jobs**, and CURE-E added one while curing the
class. The extraction is overdue independently of TOOL-7.

For comparison, the precedent works: `tests/helpers/codeOnlySource.js` now has **23 importers**
(its own header, written when it had ten, predicted this).

---

## 7. RECOMMENDATION

1. **Build arm B as Rule 5 of `contractTestAntiVacuity.walker.test.js`, scoped `tests/**` +
   `scripts/**`, after curing the ≥18 live B1 sites.** Highest value per unit of risk: the class
   is confirmed live (it went half-blind for five landings), the predicate is
   false-positive-free, the home already owns the class and already declares this exact gap, the
   mutation row is already `self-proving-meta`, and the cure per site is ~6 lines of CURE-E's
   `spanBetween`. Cost: ~18 mechanical cures + 3 self-test titles + one `// anchored:` marker.
2. **Extract `objectLiteralKeys` / `fnBody` into `tests/helpers/sourceContract.js` in the same
   lane**, collapsing the six brace matchers to one and giving it the throwing contract its new
   home requires. Free today; not free later.
3. **Arm A: measure-then-decide, do not charter the walker.** The 96 convictions are real but
   overwhelmingly habitat rather than live defect. The two that are **not** habitat —
   `traditions/genesis.js:143` and `traditions/politics.js:99`, the copied tier-band pair, where
   the LHS is a **saved-campaign string** and the value handed back is the `Object` constructor —
   should be cured **now, as a two-line fix**, independent of any lint. Then let the chair decide
   whether the ESLint selector is worth ~7 merges into existing `no-restricted-syntax` blocks.
   My read: **yes eventually, no this wave** — the config-merge hazard is larger than the
   remaining risk, and it collides with arm B's own host file (§6.4).
4. **C1: a shrink-only brace-matcher baseline, not a detector.** ≥25 naive files is a real
   population, but conviction needs data-flow. A ratchet banks the win without a false-positive
   fight.
5. **C2: CLOSED — no population** (5 sites, 5 distinct labels, zero cross-file matching).

---

## 8. QUESTIONS ONLY THE CHAIR CAN ANSWER

1. **Scope of Rule 5.** The class's own two instances live in `tests/domain/` and
   `tests/components/` — outside both of the anti-vacuity walker's existing scopes. Giving Rule 5
   `tests/**` means **113 reds** (or ≥18 if B1-only) that must be **cured before landing**,
   because this file's header forbids landing a rule against an untriaged population. Confirm:
   B1-only first act, or the whole 113 in one wave?
2. **Arm A's host.** ESLint `no-restricted-syntax` is the correct instrument but needs merging
   into ~7 existing blocks under a documented "exactly ONE block per file" constraint
   (`eslint.config.js:441`). Is that config surgery in scope for a lint lane, or is it an
   owner-gated edit?
3. **Ordering collision.** `contractTestAntiVacuity.walker.test.js:357,369,382` are themselves
   three arm-A convictions. If arm A lands first, the anti-vacuity walker reds itself. Rule
   arm B before arm A, or fold the three `in` → `Object.hasOwn` conversions into arm B's lane?
4. **The tier-band pair.** `traditions/genesis.js:143` + `traditions/politics.js:99` read a
   **saved-campaign string** through a frozen literal and can return the `Object` constructor as
   a `tierIndex`. That is a live product defect, not a lint finding. Does it get its own EM row
   now, or ride with TOOL-7?
5. **The helper's home.** `tests/helpers/sourceContract.js` (a declared throwing chokepoint,
   Rule 1b already sees its members) or a new `tests/helpers/sourceDeclarations.js` beside
   `codeOnlySource.js`? Mixing a brace matcher into a file whose header promises *"every one of
   them THROWS"* requires the matchers to be made throwing — a behaviour change to
   `objectLiteralKeys`, which `vocabularyTotality`'s own arms depend on.
6. **`codeOnlySource.js`'s regex gap.** It does not blank regex literals; `codeSkeleton` in the
   anti-vacuity walker does. Two strips, two behaviours, 23 importers on the weaker one. Is
   converging them a TOOL-7 row, its own row, or CLOSED-as-intended (the estate may want the
   cheaper strip where regexes do not matter)?
7. **Measurement tip.** Everything above is measured at `63e40fe57`, one commit behind
   CURE-E/F/G. Should the lint lane re-measure at the live branch tip before chartering, or is
   the §0 delta sufficient?

---

## 9. ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

Per the owner's law (ODQ §934.56): none of these is "deferred". Each needs a slot, a decision
point, or a close-with-reason **this turn**.

1. **`src/domain/traditions/genesis.js:143` + `src/domain/traditions/politics.js:99`** — the
   copied tier-band pair; saved-campaign `tier` string through `'x' in TIER_INDEX` returns the
   `Object` constructor as `tierIndex`. **Live product defect.** → needs an EM row (Q4).
2. **`src/domain/worldPulse/commercialReasonTaxonomy.js:138-139`** — `commercialReasonMirrorOf`
   declares `@returns {string | null}` and "Total on both sides by construction"; **both** lines
   leak a prototype function (`in` on line 138, `?? null` on 139 — `??` does not catch a
   function). **The written contract is false.** → slot.
3. **`src/lib/pulseFingerprint.js:160`** — `Object.fromEntries` accumulator; a prototype-named
   engine token mints an own key holding `"function toString() { [native code] }1"` into a
   **telemetry payload**. Executed proof in §1. → slot.
4. **`src/lib/flagRegistry.js:177`** — `flag('constructor')` bypasses the unknown-flag warning and
   returns a truthy function; the fallback chain reads URL params and localStorage first. → slot.
5. **The accumulator-guard family** — `commodityFlow.js:500,505`, `generosityKernel.js:1041,1094,1121`,
   `routeNetworkLedger.js:554`, `traditionsKernel.js:448`: `if (k in writes) continue` **skips a
   write** on a prototype-named key. Same shape as the EM-B1k data-loss class. → one family row.
6. **`tests/helpers/sourceContract.js:245`** — `statementWindowAt`, the estate's declared
   fail-closed chokepoint, **brace-counts raw source** with no string/comment skip. The one
   matcher that most needs the strip does not have it. → slot with C1.
7. **`tests/lint/dossierMountRegistry.walker.test.js`** — **four** naive brace matchers
   (:877, :1449, :1462, :1487) in one 100 KB walker. → slot with C1.
8. **Six hand-rolled brace matchers for two jobs** — `fnBody` ×3, `objectLiteralKeys` ×2,
   `declarationBody` ×1 (CURE-E's, minted **while curing this class**). → folds into Q5.
9. **`tests/domain/tradeRouteSemantics.test.js:36-38,55-57`** — cited in the brief as the
   found-and-ordered exemplar. It is **not** that form: it is `src.match(regex)` +
   `expect(block).toBeTruthy()` + two liveness anchors (`length >= 6`, `toContain('road')`).
   Sound, but a *different* idiom from CURE-E's `spanBetween`. If Rule 5's message names an
   exemplar it should name CURE-E's, not this one. → correction for the lint's brief.
10. **`tests/edgeFunctions/surveyorByok.test.js`** — **five** B1 spans (:50, :138, :165, :174,
    :633) plus a B4 (:637) plus the Rule 1b hit the anti-vacuity walker's header already records
    by name (`::block`). One file, seven silent-extractor sites, on the **paid BYOK surface**.
    → highest-density single target; consider it a lane of its own.
11. **`tests/security/byokNeverLogged.test.js:89`** — a B1 span on a **security** pin whose end
    anchor is `');'`. → cure with act 1.
12. **`tests/store/autoplacementStore.test.js:101`** — end anchor is a **retirement comment**
    (`// RETIRED (R-5b`). A tidy-up deletes it and the span silently runs to EOF. → cure with act 1.
13. **`tests/domain/aiAnalyst.test.js:461`** — both anchors are **prose inside a doc**
    (`§3f THE ENRICHMENT RIDER` → `map the outcome to a response`). The most movable anchor class
    in the tree; EM-P3 moved exactly this kind. → cure with act 1.
14. **`.substring` / `.substr` are ZERO in the tree.** The brief asks for a `substring` arm; it
    would be **dead on arrival**. → CLOSE with reason.
15. **`codeOnlySource.js` blanks no regex literals** while `codeSkeleton` does; 23 importers on
    the weaker strip. → Q6.
16. **`no-prototype-builtins` is `'warn'`, not `'error'`** (`eslint.config.js:192`). The rule
    adjacent to arm A's whole class is non-blocking. → one-line decision for the chair.
17. **`tests/lint/negativeAssertionAnchor.walker.test.js:670`** holds an exact-equality `.not.`
    register row for `vocabularyTotality.walker.test.js`. Any lane touching that file's
    assertions pays it. → budget note, not a defect.
18. **My own instrument's limit, declared** — `scanB2.mjs`'s argument splitter mis-parses an
    anchor literal containing a paren (`peaceTermsGrantTerms.test.js:510` read as B3, truly B1).
    B1 is **≥21, not 20**. The shipped rule must split on the **stripped** source. → §5 class 9.
