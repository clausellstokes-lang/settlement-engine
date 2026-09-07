# RECEIPT — LANE PANTHEON-ROSTER — **COMPLETE** (opened as PARTIAL, updated after every proof)

Seat: Opus 5 — Fable-unvalidated. Chair: Fable 5.1.
⛔ **NOT GREEN UNTIL THE FIVE OWED-UNTIL-RESUME VITEST PROOFS RUN** (see §OWED).
Dock `$SC/laneROSTER`, detached at `ec1b5e3e9d5db80faa164636972bac021a04eb42` — **verified on arrival**, porcelain 0.
VITEST HOLD in force. Every vitest proof recorded as OWED-UNTIL-RESUME with its exact command.

---

## STEP 1 — the six figures, RE-DERIVED FROM THE TREE (not from the brief)

Measured by plain node (no vitest), importing `tests/helpers/kindRegistryRoster.js` and
`src/domain/realm/heraldRouting.js` directly. Script: `$SC/laneROSTER-scratch/measure-six.mjs`, EXIT=0.

| figure | brief claims | **MEASURED** | verdict |
|---|---|---|---|
| `registries` | 12 | **12** | ✅ |
| small families | `['INFORMATION','FAITH','CHANCE_MEETING']` | **`['INFORMATION','FAITH','CHANCE_MEETING']`** | ✅ |
| `allRows` | 114 | **114** (and `REGISTERED_KINDS.size` 114 — no duplicate kind) | ✅ |
| `routedTokens` | 380 | **380** | ✅ |
| `unvoiced` | 274 | **274** | ✅ |
| registered − routed | 8 | **8** | ✅ |

Per-registry widths measured: WAR_DISPOSITION 8 · WAR_LINEAGE 5 · WAR_COST 9 · WAR_RULING 14 ·
WAR_COALITION 12 · ENVOY 16 · COMMERCIAL 20 · GRAMMAR 12 · SOVEREIGNTY 15 · INFORMATION 1 ·
FAITH 1 · CHANCE_MEETING 1. Sum = 114. The three `< 5` families are the three named. **CONFIRMED.**

### The overlap the brief asked me to re-derive
The brief says *"the comment says 'the four figures'; re-derive the overlap — the roster holds the UNION."*
**MEASURED: the walker freezes ALL SIX, and so does pantheon A5. The union IS the intersection IS six.**
The pantheon comment's *"the four figures"* is not a count of what the walker freezes — it names the
four that **MOVED** at ENC-4 (`registries` 11→12, the small-family list, `allRows` 113→114,
`routedTokens` 379→380); `unvoiced` and the difference did not move. **The brief's parenthetical is
correct as history and would have been wrong as a scope.** Assertion sites:

| figure | walker `tests/lint/kindPoolFloors.walker.test.js` | pantheon `tests/domain/pantheon.test.js` |
|---|---|---|
| registries 12 | `:194` `expect(REGISTRIES).toHaveLength(12)` | `:608` |
| small families | `:225` `.toEqual([...])` | `:609` |
| allRows 114 | `:185` `const REGISTERED_KIND_COUNT = 114`, asserted `:226 :227 :369` | `:610` |
| routedTokens 380 | `:158` `const ROUTED_TOKENS = 380`, asserted `:228 :364` | `:611` |
| unvoiced 274 | `:139` `const LEGACY_UNVOICED_TOKENS = 274`, asserted `:355 :358` | `:612` |
| difference 8 | `:369` `.toBe(8)` | `:613` |

---

## ⛔⛔ STEP 2 — THE BRIEF'S MECHANISM IS REFUTED BY MEASUREMENT. A THIRD CONSUMER EXISTS.

The brief names two consumers. **There is a THIRD, and it does not import — it PARSES THE WALKER'S
SOURCE TEXT, and it FAILS CLOSED.** Four of the six figures therefore CANNOT leave the walker file.

**`scripts/base-state-capsule.mjs`** (`KIND_POOL_WALKER = 'tests/lint/kindPoolFloors.walker.test.js'`, `:43`)
reads the walker with espree and requires, in the walker's own AST:

- `:384` `constNumber(…, 'REGISTERED_KIND_COUNT')` → `constNumber` (`:180`) calls `fail()` unless the
  initialiser is a **numeric `Literal`**. `= FREEZES.registeredKinds` is a `MemberExpression` ⇒ **throws**
  `REGISTERED_KIND_COUNT is not a numeric literal`.
- `:387` same for `LEGACY_UNVOICED_TOKENS`.
- `:388` `assertionNumber(…, 'toHaveLength', 'REGISTRIES')` → requires exactly ONE
  `expect(<text containing REGISTRIES>).toHaveLength(<numeric Literal>)`; a non-Literal argument yields
  zero hits ⇒ **throws** `is not unique (found 0)`.
- `:385` `assertionNumber(…, 'toBe', 'routedAndRegistered')` → same, for the `.toBe(8)`.

**`tests/scripts/baseStateCapsule.test.js`** (`POOLS = 'tests/lint/kindPoolFloors.walker.test.js'`, `:61`)
independently re-reads the same four **by REGEX over the raw source** (`:155`–`:159`), and `numberNear`
(`:92`) **throws** when the regex does not match:

    /REGISTERED_KIND_COUNT = (\d+)/
    /LEGACY_UNVOICED_TOKENS = (\d+)/
    /expect\(REGISTRIES\)\.toHaveLength\((\d+)\)/
    /routedAndRegistered\.length\)\s*\.toBe\((\d+)\)/

⛔ **CONSEQUENCE, MEASURED:** the brief's step 2/3 as worded (*"Both tests import it and assert against
it"*, all six literals moved out) would break the base-state capsule generator AND its battery. It would
also falsify the capsule's own stamped provenance sentence (`base-state-capsule.mjs:399`): *"every PINNED
row parsed out of the test that asserts it"* — a fixture asserts nothing. Moving the capsule's canonical
home is a stamped-provenance contract change across `scripts/`, `tests/scripts/`, and
`docs/implementation/packets/infrastructure/INFRA-M2-CAPSULE.md` — **not named by this brief and not
mine to take.** REFUSED, and referred to the chair.

**NOT source-scanned, and therefore genuinely free to move:** `ROUTED_TOKENS` (the capsule reads
`routedTokens` MEASURED from `src/domain/realm/heraldRouting.js`, `:95`/`:383`, never from the walker)
and the small-family list (nothing parses it).

### THE JUDGMENT CALL (vetoable)
**CHARTER THE PERMISSION, MEASURE THE MECHANISM.** The chair's permission — *a minting commit must never
be able to fork these again* — is honoured in full. The chair's mechanism — *delete the literals from both
tests* — is refuted for four of six. Built instead:

- **ONE ROSTER OF RECORD** holds all six as literals.
- **pantheon A5's hand copy — the copy that actually forked, twice (WF-8a, ENC-4) — is DELETED.** All six
  read the roster. This is the cure at the site of the defect.
- **The walker keeps its four capsule-parsed literals** and each is bound to the roster by an **executed
  equality** in an existing `it()`. Roster == walker == tree, all three asserted. A commit that moves one
  side alone REDS. The fork is closed by assertion rather than by deletion.
- The two free figures (`ROUTED_TOKENS`, small families) become **roster-only** in the walker too.

**Home chosen: `tests/helpers/kindRegistryRoster.js` — the EXISTING roster, not a new file.**
The brief's `tests/fixtures/kindRegistrationRoster.js` was offered as *"e.g."*. Reasons: (a) both
consumers already import it; (b) the registry roster and the figures derived from it belong in one file —
a registry joining IS what moves the figures, so a registering commit edits ONE place; (c) **it adds NO
file, so the ratchet `totalFiles`, the lighting census `files/credited/titles/suiteTitles` and the
mutation-coverage manifest all move by ZERO** — a new file under `tests/` would have owed register acts;
(d) that file's docblock currently states the law the chair just overturned (*"The FIGURES derived from
this roster stay literal in each consumer"*), and leaving it standing beside a competing fixture would
create a third claim about where truth lives.

---

## STEP 3 — BUILT. Three commits, each green on its own.

| sha | step | file | outcome |
|---|---|---|---|
| `d52113a3a` | 2 | `tests/helpers/kindRegistryRoster.js` | `KIND_REGISTRATION_FREEZES` added — the ONE roster of record, six literals + the attribution rule |
| `e4bdb96f6` | 3a | `tests/domain/pantheon.test.js` | A5's six hand literals DELETED; all six read the roster |
| `7871d1622` | 3b | `tests/lint/kindPoolFloors.walker.test.js` | 2 figures roster-only; the 4 capsule-parsed numerals kept and BOUND by executed equality |

`ROUTED_TOKENS` and the small-family list are **roster-only** in the walker (nothing parses either).
`REGISTERED_KIND_COUNT` / `LEGACY_UNVOICED_TOKENS` / `toHaveLength(12)` / `.toBe(8)` keep their bare
numerals and each gains an equality against the roster inside an EXISTING `it()` — no new title.

**Zero VALUE changed.** 12 · `['INFORMATION','FAITH','CHANCE_MEETING']` · 114 · 380 · 274 · 8, before
and after, each still asserted against the LIVE tree in both files. Nothing is derived.

---

## STEP 4 — THE PLANT PROOF (plain node; vitest OWED)

Driver `$SC/laneROSTER-scratch/drive-arms.mjs` reproduces all six arms as BOTH consumers spell them
(16 arms) against the live registries and `heraldRouting`. Baseline **16 green / 0 RED**.

### Round 1 — plant ONE roster figure: **BOTH consumers red, every time**
| plant | reds |
|---|---|
| `registries: 12 → 13` | pantheon A5 · registries · **and** walker · roster BINDS registries |
| smallFamilies drop `CHANCE_MEETING` | pantheon A5 · smallFamilies · **and** walker · smallFamilies from roster |
| `registeredKinds: 114 → 115` | pantheon A5 · registeredKinds · **and** walker · roster BINDS registeredKinds |
| `routedTokens: 380 → 381` | pantheon A5 · routedTokens · **and** walker · ROUTED_TOKENS from roster vs tree |
| `unvoicedTokens: 274 → 273` | pantheon A5 · unvoicedTokens · **and** walker · roster BINDS unvoicedTokens |
| `registeredMinusRouted: 8 → 9` | pantheon A5 · registeredMinusRouted · **and** walker · roster BINDS registeredMinusRouted |

Each 14 green / 2 RED. Every restore by INVERSE EDIT, each `cmp` against the pre-plant backup
**IDENTICAL**; porcelain 0 after every round.

### Round 2 — THE ENC-4 SHAPE: move a WALKER literal and forget the roster
| plant | reds |
|---|---|
| `REGISTERED_KIND_COUNT 114 → 115` | walker · ALL_ROWS vs REGISTERED_KIND_COUNT **and** walker · roster BINDS registeredKinds |
| `LEGACY_UNVOICED_TOKENS 274 → 273` | walker · unvoiced vs LEGACY_UNVOICED_TOKENS **and** walker · roster BINDS unvoicedTokens |
| `toHaveLength(12) → (13)` | walker · REGISTRIES toHaveLength (literal vs tree) |
| `.toBe(8) → .toBe(9)` | walker · routed identity literal |

⭐ **This is the cure.** ENC-4 landed green in the walker — the file a registering lane actually runs —
while A5 went red unseen. Now the walker itself reds. All restores `cmp` IDENTICAL.

### Round 3 — THE BRIEF'S MECHANISM, EXECUTED (the negative control for my refusal)
Replacing each capsule-parsed numeral with a roster read, one at a time, and running the two engines
verbatim (`$SC/laneROSTER-scratch/capsule-replica.mjs`):

| plant | espree engine | regex engine |
|---|---|---|
| `REGISTERED_KIND_COUNT = FREEZES.registeredKinds` | THROW `REGISTERED_KIND_COUNT is not a numeric literal` | THROW `could not independently read REGISTERED_KIND_COUNT` |
| `LEGACY_UNVOICED_TOKENS = FREEZES.unvoicedTokens` | THROW `... is not a numeric literal` | THROW `could not independently read LEGACY_UNVOICED_TOKENS` |
| `toHaveLength(FREEZES.registries)` | THROW `expect(REGISTRIES).toHaveLength(n) is not unique (found 0: [])` | THROW `could not independently read REGISTRIES` |
| `.toBe(FREEZES.registeredMinusRouted)` | THROW `expect(routedAndRegistered).toBe(n) is not unique (found 0: [])` | THROW `could not independently read the routed identity` |

**8 of 8 reads break.** My refusal is now **CONFIRMED by execution**, not reasoning. Restored:
**ALL 8 CAPSULE READS INTACT**, exit 0, and all three files `cmp`-IDENTICAL to their pre-plant content.

---

## STEP 5 — THE SWEEP FOR OTHER HAND-FROZEN COPIES

The brief's grep re-run, then widened to the whole `tests/` tree by SHAPE (every reader of
`EXACT_SECTION`, every multi-registry union, every `toBe/toHaveLength` on the six values).

**FOLDED INTO THE ROSTER (the only two true copies):** `tests/lint/kindPoolFloors.walker.test.js`
and `tests/domain/pantheon.test.js`. There were no others.

**PROVABLY A DIFFERENT POPULATION** — each names its own denominator, none is the estate census:

| site | figure | why it is different |
|---|---|---|
| `tests/lint/grammarLifecycleKindPools.walker.test.js:131` | `GRAMMAR_KIND_REGISTRY` **12** | ⚠ ONE family's width. **Coincides in VALUE with `registries: 12` and is unrelated** — measured GRAMMAR = 12 rows, estate = 12 families |
| `tests/lint/warCoalitionKindPools.walker.test.js:63` | `WAR_COALITION_KIND_REGISTRY` **12** | ⚠ same coincidence, same reason (measured WAR_COALITION = 12 rows) |
| `tests/lint/commercialKindPools.walker.test.js:131` | `COMMERCIAL_KIND_REGISTRY` **20** | one family's width |
| `tests/lint/couplingDesk.walker.test.js:383` | `DISPUTED` **4** | a four-registry partial union, freezes no estate total |
| `tests/lint/heraldRouting.walker.test.js:135-142` | — | reads `EXACT_SECTION` for TOTALITY and shape; **freezes no count** |
| `tests/lint/writerReach.walker.test.js:22` | **380** of 437 | `src/domain/worldPulse` FILE count, in a comment |
| `tests/domain/demographicsFloor.test.js` (×7) | **380** | a settlement POPULATION |
| `tests/domain/townCartographyCalibration.test.js:137/174/202` | **114** | `FROZEN.maxBuildings` for the town tier |
| `tests/lint/migrationSearchPathPin.test.js:9`, `migrationGrantPosturePin.test.js` | 113/114/115 | MIGRATION numbers |
| `tests/domain/townSceneCartography.test.js:145` | **380** | a polygon coordinate |
| `tests/domain/npc/characterConsumers.test.js:864/868` | **113** | a tick |
| `proseNumerics`, `localeFormatGuard`, `exportTokenCoverage`, `sovereigntyLightingContract` | 113/379 | ODQ section numbers, source line numbers, lighting-census tuples |
| `.tuning-inventory.json`, `.prose-numerics-baseline.json` | 113/114 | `"line":` fields |

⚠ **The 12-coincidence is worth the chair's eye**: three sites in `tests/lint` freeze the numeral 12
against three DIFFERENT denominators. A future lane grepping `12` to "fold the roster" would fold the
wrong one. Each of the three names its own registry in its own assertion, which is what makes them
separable — recorded, not changed.

---

## REGISTER DELTAS — **ALL ZERO** (predicted in writing, then measured)

| register | predicted | measured | how |
|---|---|---|---|
| lighting `titles` / `suiteTitles` | +0 / +0 | **+0 / +0** | `diff` of every `test(`/`it(`/`describe(` line, both files: EMPTY. pantheon 36/12 → 36/12; walker **12/4 → 12/4**, the exact 12/4 the census records for this file at `sovereigntyLightingContract.walker.test.js:3222` |
| lighting `files` / `credited` / `parked` | +0 | **+0** | no file added, renamed or deleted |
| test-ratchet `totalFiles` | +0 | **+0** | same |
| mutation-coverage manifest | no row owed | **none owed** | no new file; the walker's row is `kind: rationale`, not line-pinned |
| capsule PINNED rows (4) | unmoved | **114 / 8 / 274 / 12 unmoved**, both engines | `capsule-replica.mjs` exit 0 |
| `.size-baseline.json`, `.test-ratchet-baseline.json`, `.wizard-news-authoring-baseline.json` | absent | **absent** — none of the three files appears in any |
| any frozen VALUE | unchanged | **unchanged** | roster-vs-tree check, all six OK |

**No register act taken. No `src/` change. No new file. No `it()` title moved.**

---

## ⏳ OWED-UNTIL-RESUME — the vitest proofs, with exact commands

The chair's VITEST HOLD was in force for this lane's whole run; **no vitest was executed.** Run on RESUME:

1. `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/pantheon.test.js`
2. `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/kindPoolFloors.walker.test.js`
3. ⛔ **`sh scripts/gate-mutex.sh --run -- npx vitest run tests/scripts/baseStateCapsule.test.js`** — the
   capsule battery, the one this lane's design turns on. Replicated green, but replica ≠ the real file.
4. `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint` — the **`tests/lint/` DIRECTORY RUN**.
   ⚠ Strictly the preamble's trigger did NOT fire (no file added, renamed or deleted under `src/` or
   `tests/`), but a `tests/lint` file was modified, so it is owed and recorded rather than waived.
5. The plant replays under vitest: re-run Round 1 and Round 2 above and confirm the same arms red.

Everything proven so far is by **plain node, eslint, and verbatim replicas of the two source-scanning
engines** — labelled accordingly below.

---

## CONFIRMED vs PLAUSIBLE

**CONFIRMED (executed, output quoted above):** the six figures' live values · the walker/A5 assertion
sites · the roster equals the tree · all six plants red both consumers · the four walker plants red ·
the brief's mechanism breaks 8 of 8 capsule reads · the capsule reads survive my change on both
engines · every restore `cmp`-identical · zero title motion in both files · eslint clean · porcelain 0.

**PLAUSIBLE (reasoned, not executed):** that the full `tests/lint` directory and
`tests/scripts/baseStateCapsule.test.js` go green under vitest. The arms are replicated faithfully and
every replicated arm is green, but the hold prevented the real run. **Do not report this lane green
until proof 3 and proof 4 above have run.**

---

## ⭐ RETROVALIDATION ROW — for the Fable chair

| what was judged | what the chair must re-derive | receipts by path | priority |
|---|---|---|---|
| **The chair's mechanism was refused.** "The six freezes live in ONE place" is unreachable for four of them: `scripts/base-state-capsule.mjs` (`:384 :385 :387 :388`) and `tests/scripts/baseStateCapsule.test.js` (`:155`–`:159`) parse them out of the walker's SOURCE and fail closed. Built instead: one roster of record; A5's copy deleted; the walker's four numerals kept and BOUND by executed equality | Re-derive that the four capsule reads genuinely fail on a non-literal, and RULE whether the capsule's canonical home should move to the roster (that would make the "ONE place" ruling reachable, at the cost of `scripts/` + `tests/scripts/` + `INFRA-M2-CAPSULE.md` and the capsule's provenance sentence *"every PINNED row parsed out of the test that asserts it"* — a fixture asserts nothing) | `$SC/laneROSTER-scratch/capsule-replica.mjs` (Round 3: 8 of 8 THROW) · `laneROSTER:7871d1622` | ⛔ **HIGH — this is the one ruling I overturned** |
| **The roster's HOME was moved off the brief's suggestion**, from a new `tests/fixtures/kindRegistrationRoster.js` to the EXISTING `tests/helpers/kindRegistryRoster.js` | Re-derive that adding no file is worth more than the suggested path: it keeps lighting `files/credited/titles/suiteTitles`, the ratchet `totalFiles` and the mutation manifest at +0, and it puts the figures beside the registry list that moves them | `laneROSTER:d52113a3a` · title diffs in the Register Deltas table | MEDIUM |
| **The binding shape**: two figures roster-only, four duplicated-and-bound. Two binds compare roster↔walker literal, two compare roster↔live tree — both catch a one-sided move, proven in Rounds 1 and 2 | Re-derive that a fork cannot land green in EITHER direction, and decide whether the asymmetry should be made uniform | Rounds 1–2 in `drive-arms.mjs` | MEDIUM |
| **A brief error found**: the brief asks which of the six the walker "also freezes" (*"the comment says 'the four figures'"*). The walker freezes **all six**; union = intersection = six. The *"four"* in A5's comment names the four that MOVED at ENC-4, not a subset the walker holds | Nothing to re-derive — recorded so the next lane does not scope to four | Step 1 table above | LOW |
| **A coincidence hazard recorded, not changed**: `GRAMMAR_KIND_REGISTRY` and `WAR_COALITION_KIND_REGISTRY` are each frozen at **12**, the same numeral as `registries: 12`, against different denominators | Re-derive before any future "fold the 12s" sweep | Step 5 table | LOW |
| **The vitest hold** — every proof is plain-node or a verbatim engine replica | Run the five commands in OWED-UNTIL-RESUME before treating this lane as green | this receipt, §OWED | ⛔ **HIGH** |

---

## DOCK TIP (last line, as the brief requires)

    laneROSTER detached tip: 7871d16223697c2e8444d0034582e97d446638c9
    porcelain: 0 · base: ec1b5e3e9d5db80faa164636972bac021a04eb42 (+3 commits)

**RECEIPT COMPLETE.**
