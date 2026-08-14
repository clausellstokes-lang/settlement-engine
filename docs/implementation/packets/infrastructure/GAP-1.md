# INFRA / GAP-1 — the non-canonical RECEIVER widening of the engine-gated census walker

**Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` at SHA-256
`cd04a46315c919694d6eb5a043d74fe6173ec11be359be932d40ecf04af232f5`.

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `5d6a0e7c19d5a0d58880ee3db9ff8c2b537ece5c`
- **Promoted:** 2026-08-14 by Lane TE4 as the single member of the `gap-1` train,
  under `OWNER_DECISION_QUEUE.md` §32 (chair, vetoable), which rules all five of
  this packet's open questions. §13 records each ruling and the one place where
  live code refused the ruled shape's literal predicate. Lane G2 restamped Lane
  G1's draft at `5d6a0e7c` and found a landed contract that refused two of the
  four dispositions as drafted (§4.3); §32 ruling 1 accepts the split cure.
- **Id / home:** `docs/implementation/packets/infrastructure/GAP-1.md`. The INFRA
  volume is the right home: this packet moves an enforcement walker and no
  product surface.
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`,
  branch `claude/composite-r4`. The base commit is
  `docs: land the infra-1 train terminal`; `git status --porcelain` was **empty**
  at the read. Every figure in this packet was executed by Lane G2 at this sha and
  re-executed by Lane TE4 before its first edit.
  ⛔ **No figure is inherited from Lane G1's draft**, which was measured at
  `cdd4bf52`, thirteen commits back.
- **Capsule:** `docs/implementation/BASE_STATE.json`, SHA-256
  `0e8017eb0a4f0d9ad5b03cf564bb0fce2b6679aed405450f099a8c792d6cb7c2`, `stampedAt`
  `cfcc2fa2`. **The consumption law's docs-only clause is satisfied and EXECUTED:**
  `git diff --name-only cfcc2fa2..5d6a0e7c` returns six paths, **all under `docs/`**
  (`grep -v '^docs/'` exited 1). This packet cites exactly two capsule rows —
  `lightingCensus` `2418/366/2052/20024/5643` and `flagManifestRows` 16 — and
  re-executes every row its own manifest touches, per the law's refusal of
  capsule-only compilation.
- **Origin:** the diagnostic-soak design's §4 limit 6 ordered the scan; Lane SD
  reported GAP-1; Lane G1 drafted the cure at `cdd4bf52`; this is the restamp.
- **Collision group:** **NONE under the recommended shape.** §5 shows the packet is
  census-NEUTRAL as designed and therefore does **not** take the estate-wide
  lighting-census reservation. This reverses Lane G1's §5.1, which was wrong (§5.3).
- **Commit authority:** none granted here.

---

## 1. The class, stated exactly

`tests/lint/engineGatedRuleKeys.walker.test.js` exists to remove the
CENSUS-INVISIBLE SUBSYSTEM class (chair ruling CR-WR10-C). Its walk source-scans
`src/` for the strict gate idiom and proves `ENGINE_GATED_VIRTUAL_RULE_KEYS`
against that measurement both ways. Its detector is one regex, at **`:243`**:

```js
const GATE_RE = /\b(?:rules|simulationRules)\s*\)?\s*\??\.\s*([A-Za-z_$][\w$]*)\s*===\s*true/g;
```

The regex constrains the **RECEIVER** to the two literal tokens `rules` and
`simulationRules`, tolerating one intervening `)` and an optional `?.`. Its stated
claim — the header's *"Source-scan `src/` for the strict gate idiom"* — is wider
than what the regex can reach. **A real, strict, engine-gated `simulationRules`
read whose receiver is spelled any other way is invisible, and the walker stays
green.**

The walker's own header records a NARROWER version of this hole at **`:177-186`**:
the *frozen-list conjunction* (`REQUIRED_RULES.every((key) => rules[key] === true)`).
The measured class is broader. The measured hole is **any non-canonical receiver**,
with three live shapes and seven live keys — and **zero** live instances of the
frozen-list shape the header names. This packet widens the recorded class to the
measured one and closes it.

---

## 2. Executed measurement at `5d6a0e7c` — the hidden-key list DID NOT MOVE

Method: Lane G2 re-implemented the walker's own `codeOnly()` blanker verbatim
(copied from `:196-236`) and re-ran the walker's own `GATE_RE` plus the widened
arms over the same corpus the walker walks (`src/**/*.{js,jsx}`).

| Scan | At `cdd4bf52` (G1) | **At `5d6a0e7c` (G2)** |
|---|---:|---:|
| files walked | 2,114 | **2,116** |
| `codeOnly()` + live `GATE_RE` — the walker's own measurement | 63 | **63** |
| `\b[a-z][A-Za-z0-9]*Enabled\b`, RAW source | 131 | **131** |
| same token scan, after `codeOnly()` blanking | 122 | **122** |
| `simulationRuleKeys()` census | 73 | **73** |
| `ENGINE_GATED_VIRTUAL_RULE_KEYS` | 16 | **16** |
| `SUBSYSTEM_CERTIFICATION_REGISTRY` rows | 72 | **72** |
| `SUBSYSTEM_CERTIFICATION_PENDING_KEYS` | 1 | **1** (`majorChangesRequireProposal`) |
| `BACKLOG_RULE_KEYS` / `EXEMPT_RULE_KEYS` | 17 / 1 | **17 / 1** |

**Only `files` moved, by +2** — the two src leaves the trains created
(`treatySuccessionDossier.js`, `treatySuccessionReaffirmedVoice.js`). Every other
figure is byte-identical.

### 2.1 WHY it did not move — the executed proof, not an assumption

```
git diff cdd4bf52..5d6a0e7c -- src | grep -E '^[+-]' | grep -v '^[+-][+-]' | grep Enabled
GREP_EXIT=1
```

⭐ **Not one line containing the token `Enabled` was added or removed anywhere in
the thirteen-commit `src/` delta.** The two trains minted **zero** new gates, in
any receiver spelling. That is the strongest possible form of the "did the list
move" answer: it did not move because the population it is drawn from did not
move.

The delta's two `Enabled` reads are both **pre-existing canonical** lines —
`settlementRumors.js:796` (`rules && rules.distancePricedNewsEnabled === true`)
and `campaignWorldPulseDeferred.js:274` (`rules?.spatialConsequenceEnabled === true`),
both already among the 63.

### 2.2 The ten non-canonical hits, RE-GROUNDED by reading each enclosing scope

Every line number below was re-read at `5d6a0e7c`. All hold.

| # | Key | Site at `5d6a0e7c` | Receiver | Verdict |
|---|---|---|---|---|
| 1 | `settlementPoliticsEnabled` | `src/domain/worldPulse/settlementPolitics.js:169` | `const r = /** @type … */ (rules)` | **REAL, HIDDEN, UNACCOUNTED** |
| 2 | `underwaysOrganicFoundingEnabled` | `src/domain/worldPulse/institutionLifecycle.js:661` | `(context.simulationRules \|\| worldState?.simulationRules \|\| {})` | **REAL, HIDDEN, UNACCOUNTED** |
| 3 | `institutionPoliticalControlEnabled` | `src/domain/worldPulse/institutionLifecycle.js:665` | same | **REAL, HIDDEN, UNACCOUNTED** |
| 4 | `biomeTruthEnabled` | `src/store/campaignSpatialCanonize.js:75` | `const priorRules = /** @type … */ ((…).simulationRules \|\| {})` | **REAL, HIDDEN, UNACCOUNTED** |
| 5 | `factionCompetitionEnabled` | `settlementPolitics.js:169` | alias `r` | REAL, HIDDEN, **already in census** (`DEFAULT_SIMULATION_RULES`-declared `true`) |
| 6 | `interventionEnabled` | `convergence.js:227` | alias `r` | REAL, HIDDEN, **already in census** (preset-declared) |
| 7 | `supplyWebWarfareEnabled` | `supplyWebWarfare.js:259` | alias `r` | REAL, HIDDEN, **already in census** (preset-declared) |
| 8 | `ancientRuinsEnabled` | `generators/historyGenerator.js:865` | `config?.` | **NOT A GATE** — settlement-generator config |
| 9 | `appetiteEnabled` | `worldPulse/dispositionLedger.js:593` | `options?.` | **NOT A GATE** — a function option fed by `strategicPostureEnabled` |
| 10 | `dispositionEnabled` | `worldPulse/dispositionChannels.js:69,:74` | `args.` | **NOT A GATE** — arg forwarding `dispositionChannelsEnabled` |

Membership re-executed by importing the live modules at `5d6a0e7c`:

```
settlementPoliticsEnabled           census=false manifest=false default=false full=undefined  presetDeclared=false
underwaysOrganicFoundingEnabled     census=false manifest=false default=false full=undefined  presetDeclared=false
institutionPoliticalControlEnabled  census=false manifest=false default=false full=undefined  presetDeclared=false
biomeTruthEnabled                   census=false manifest=false default=false full=undefined  presetDeclared=false
factionCompetitionEnabled           census=true  manifest=false default=true  full=true       presetDeclared=true
interventionEnabled                 census=true  manifest=false default=false full=true       presetDeclared=true
supplyWebWarfareEnabled             census=true  manifest=false default=false full=true       presetDeclared=true
```

**Rows 5-7 are the packet's best argument.** The same hidden receiver shape sits on
both accounted and unaccounted keys, so today's green is an **accident of
declaration, not a measurement**.

### 2.3 The three receiver shapes

| Shape | Spelling | Files | Key-reads |
|---|---|---|---|
| **A — JSDoc-cast ALIAS local** | `const r = /** @type {Record<string, unknown>} */ (rules); … r.<key> === true` | `settlementPolitics.js`, `convergence.js`, `supplyWebWarfare.js` | **6** |
| **B — `\|\|`-defaulted parenthesised expression** | `(context.simulationRules \|\| worldState?.simulationRules \|\| {}).<key> === true` | `institutionLifecycle.js` | **2** |
| **C — differently-named local bound from `.simulationRules`** | `const priorRules = /** @type … */ ((…).simulationRules \|\| {}); priorRules.<key> === true` | `campaignSpatialCanonize.js` | **1** |

Shape A is not one site; it is a recurring three-file estate idiom.

### 2.4 Why the LOCAL cure is refused — the measurement is WORSE than G1 reported

Lane WW-A's precedent cure was a redundant by-name canonical read at each gate
site. Refused, on three measured grounds. All effective-line figures executed at
`5d6a0e7c` with eslint's own `Linter`, `max-lines`, `skipBlankLines: true,
skipComments: true` — never `wc -l`, never inherited.

| File | Effective | Ceiling | Headroom | size-baseline entry? |
|---|---:|---:|---:|---|
| **`src/domain/worldPulse/convergence.js`** | **798** | 800 | **2** | **none** |
| `src/domain/worldPulse/institutionLifecycle.js` | **784** | 800 | **16** | none |
| `src/domain/worldPulse/settlementPolitics.js` | 560 | 800 | 240 | none |
| `src/domain/worldPulse/supplyWebWarfare.js` | 537 | 800 | 263 | none |
| `src/domain/certification/subsystemRowsVirtual.js` | 493 | 800 | 307 | none |
| `src/domain/worldPulse/simulationRules.js` | 302 | 800 | 498 | none |
| `src/store/campaignSpatialCanonize.js` | 89 | 800 | 711 | none |
| `tests/lint/engineGatedRuleKeys.walker.test.js` | 334 | 800 | 466 | none |

1. The local cure does not remove the class — the next lane spells the next gate
   the same way.
2. ⛔ **`convergence.js` has TWO effective lines of headroom.** Lane G1 did not
   measure this file; its draft named `institutionLifecycle.js` (16 lines) as the
   binding constraint. The real constraint is four times tighter, on a file that
   carries one of the hidden gate reads (row 6) **and** is the M5 mutant target.
3. A redundant read is a second writer of the same fact.

⚠ **`convergence.js` at 798/800 meets PACKET_STANDARD's own hot-file definition**
(within a handful of effective lines of a ceiling that will not be raised, no
`scripts/.size-baseline.json` entry, no door) and is **absent from the standing
list**, which today names only `OutputContainer.jsx` 599/600, `peaceTerms.js`
797/800 and `informationStatecraft.js` 780/800. `convergence.js` is **hotter than
two of the three**. Adding it is a coordinator act requiring an executed
measurement; this table is that measurement. Recorded as OQ-G2-3.

---

## 3. The widened detection — DESIGNED, RE-PROVED BOTH DIRECTIONS at `5d6a0e7c`

### 3.1 Shape

`GATE_RE` survives intact as **arm 1**; two arms join it. `scanGateReads` becomes
the union of three arms. ⛔ **Nothing about `codeOnly()` changes** (§6.3).

```js
// ARM 1 — UNCHANGED. Today's canonical gate. FULL key vocabulary (it is the only
// arm that measures `routineMajorApproval`, which does not end in `Enabled`).
const GATE_RE = /\b(?:rules|simulationRules)\s*\)?\s*\??\.\s*([A-Za-z_$][\w$]*)\s*===\s*true/g;

// ARM 2 — the `||`-defaulted parenthesised receiver EXPRESSION (shape B).
// The tail admits NO dot and NO paren, so it can never bridge across a member
// chain: `rules.aEnabled === true && x.bEnabled === true` cannot attribute
// `bEnabled` to `rules`. Restricted to /Enabled$/ keys.
const GATE_EXPR_RE = /\b(?:rules|simulationRules)\b[^()\n.]*\)\s*\??\.\s*([A-Za-z_$][\w$]*Enabled)\s*===\s*true/g;

// ARM 3 — the resolved local ALIAS receiver (shapes A and C), with two guards.
const BIND_RE = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]*);/g;
const ALIAS_READ_RE = /\b([A-Za-z_$][\w$]*)\s*\??\.\s*([A-Za-z_$][\w$]*Enabled)\s*===\s*true/g;
```

An identifier is a rules receiver in a file when its binding right-hand side is one
of exactly three shapes, iterated to a fixpoint so an alias-of-an-alias resolves:

- a **pure re-alias** of a known receiver — `^[\s(]*(?:<known>)[\s)]*$`, which is
  what `const r = /** @type … */ (rules);` reduces to after comment blanking;
- an rhs **ending in a `.simulationRules` access**, optionally `|| {}`-defaulted
  and paren-closed — `/\.\s*simulationRules\b\s*(?:\|\|\s*\{\s*\}\s*)?\)*\s*$/`;
- the **ternary null-guard idiom** whose live arm is `.simulationRules` —
  `/\?\s*[A-Za-z_$][\w$.?]*\.\s*simulationRules\s*:\s*null\s*$/`.

### 3.2 The three guards, each found EMPIRICALLY

**GUARD 1 — the trailing `\b`.** An alternation written `\b(?:rules|simulationRules|r)`
with no trailing `\b` matches the `r` inside `return` and inside `rosterEntry`. The
un-bounded prototype produced two false positives: `revealed` at
`settlementPolitics.js:805` (from `return leash.`) and `isGoverning` at `:251`
(from `rosterEntry ? rosterEntry.`). Word-bound both ends.

**GUARD 2 — NEAREST-PRECEDING-BINDING WINS, never a file-wide alias set.**
`convergence.js` binds the name `r` **six times** (`:226, :434, :508, :801, :1062,
:1286`); exactly one (`:226`) is the rules cast. A file-wide alias set attributed
`r.invited === true` at `:515` — whose nearest preceding binding is
`const r = asObject(raw[k]);` at `:508` — to the rules object. Record every binding
of every name in source order with a rules/not-rules tag; attribute a read only when
the **nearest binding preceding that read's offset** is a rules binding.

**GUARD 3 — arms 2 and 3 are restricted to `/Enabled$/`; arm 1 is not.** A
deliberate asymmetry. Arm 1 must keep the full vocabulary because it is the only arm
measuring `routineMajorApproval`. On non-canonical receivers the key name is the
only remaining discriminator.

**REJECTED ALTERNATIVE, recorded.** A `loose` variant admitting any rhs merely
*containing* `.simulationRules` over-admits: it made `underwaysFoundingLit` — itself
the RESULT of a gate read — a receiver, taking the gained set 7 → 8. Rejected on
executed evidence.

**REJECTED ALTERNATIVE, recorded.** Resolving the frozen-list conjunction the
walker's header names. **Zero live instances measured at `5d6a0e7c`**, so a guard
for it is a pin over an empty population — the recorded vacuity class. It stays an
open residual (§8), stated as one.

### 3.3 THE PROOF — both directions, executed at `5d6a0e7c`

```
TODAY=63  WIDE=70  LOST=0  GAINED=7
DIRECTION A — every currently-measured key still measured. LOST = NONE
DIRECTION B — newly caught (7):
   biomeTruthEnabled                   [alias]  src/store/campaignSpatialCanonize.js:75
   factionCompetitionEnabled           [alias]  src/domain/worldPulse/settlementPolitics.js:169
   institutionPoliticalControlEnabled  [expr]   src/domain/worldPulse/institutionLifecycle.js:665
   interventionEnabled                 [alias]  src/domain/worldPulse/convergence.js:227
   settlementPoliticsEnabled           [alias]  src/domain/worldPulse/settlementPolitics.js:169
   supplyWebWarfareEnabled             [alias]  src/domain/worldPulse/supplyWebWarfare.js:259
   underwaysOrganicFoundingEnabled     [expr]   src/domain/worldPulse/institutionLifecycle.js:661
SITES by arm: {"canonical":113,"expr":46,"alias":9}
```

- **Direction A — no regression: `LOST = 0`.** All **63** currently-measured keys
  are still measured. The widened scanner is a strict superset.
- **Direction B — every known-hidden key is caught: `GAINED = 7`**, exactly rows
  1-7 of §2.2.
- **Zero new false positives.** The gained set contains none of rows 8-10 and none
  of `invited` / `isGoverning` / `revealed`. An unconstrained scan reaches 72 keys;
  `72 − 63 = 9` were candidates; the widened scanner admits **7** and refuses the
  other **3**, plus the 3 scope/boundary artifacts the guards kill.
- The arm counts are **identical to G1's** (113/46/9) despite +2 files, which is the
  same fact §2.1 proves from the other side.

### 3.4 THE NEW-LANDING FALSE-POSITIVE CHECK — the trains' own files, scanned

The mission requires that the reaffirmed voice's mount and IP-1's files not confuse
the widened scan. All three arms were run over exactly the eleven `src/` paths the
thirteen commits created or modified:

```
ARM1 canonical hits in the delta: 2
    distancePricedNewsEnabled  src/domain/display/settlementRumors.js
    spatialConsequenceEnabled  src/store/campaignWorldPulseDeferred.js
ARM2 expr hits in the delta: 0
ARM3 non-canonical receiver candidates in the delta: 0
```

**Zero arm-2 hits, zero arm-3 candidates.** Both arm-1 hits are pre-existing lines
already among the 63. `treatySuccessionReaffirmedVoice.js` and
`treatySuccessionDossier.js` contain the token `Enabled` **zero** times. The new
landings are invisible to the widening in both polarities. **CONFIRMED.**

---

## 4. DISPOSITION of each hidden key

Three of the seven gained keys — `factionCompetitionEnabled`, `interventionEnabled`,
`supplyWebWarfareEnabled` — are **already in the 73-key census** (executed). They
need no disposition; the widening simply makes their gate reads visible, at zero
cost.

The four unaccounted keys each need one. Executed prediction of the walker's red,
run through the live `auditEngineGatedKeys` inputs at `5d6a0e7c`:

```
PREDICTED unaccountedReads (direction 2 RED):
  ["biomeTruthEnabled","institutionPoliticalControlEnabled",
   "settlementPoliticsEnabled","underwaysOrganicFoundingEnabled"]
PREDICTED backlog EXACT arm: measuredGap grows 17 -> 21
census-accounted gained (zero cost):
  ["factionCompetitionEnabled","interventionEnabled","supplyWebWarfareEnabled"]
```

*(PLAUSIBLE, not CONFIRMED — pure set arithmetic on the live inputs, not an executed
vitest run of the walker against a widened tree. A draft lane runs no suite.
Promoting it costs one focused `npx vitest run tests/lint/engineGatedRuleKeys.walker.test.js`
against a tree carrying the widened regex.)*

⛔ **THE BACKLOG IS NOT AVAILABLE FOR ANY OF THEM.** `BACKLOG_RULE_KEYS` is asserted
EXACT against `measuredGap` at `:574-577` and capped `toBeLessThanOrEqual(17)` at
`:580`. The walker's own header at `:141-144` states the law verbatim: *"a key
leaves only by joining the manifest (with its row) or the exempt list (with its
rationale), and a NEW dark gate cannot join — it reds as unaccounted until somebody
decides which it is."* **Manifest, or exempt. There is no third door.**

### D-1 `settlementPoliticsEnabled` → **MANIFEST + certification row.** STANDS.

Re-read in full at `5d6a0e7c`: `settlementPoliticsActive()`
(`settlementPolitics.js:165-170`) is the whole layer's door; the gate is `:169`. Its
consumers are `settlementStrategy.js:1222`, `warSeatBooks.js:496`, and the layer's
own writers at `settlementPolitics.js:530` and `:716`. The module owns its tuning
table (`DECISION_LOAD_SPAN`, `RULING_CONSOLIDATION_FLOOR`), its vocabulary
(`blocId`, ruling bloc, `coalitionConsolidation01`), and its dormancy golden at
`tests/property/settlementPoliticsDormancyGolden.test.js`. **Subsystem by every
criterion CR-WR10-C names.**

⭐ **And it clears the cohort contract §4.3 refuses the others on:**
`grep -c candidateType src/domain/worldPulse/settlementPolitics.js` → **0**. Its
lane leaf can take the empty-eventTypes claim honestly.

⚠ It is a **CONJUNCTION** with `factionCompetitionEnabled`, which is
`DEFAULT_SIMULATION_RULES`-declared `true` and lit at `full_simulation` — so lighting
`settlementPoliticsEnabled` alone genuinely lights the layer, and the row must say so.

### D-4 `biomeTruthEnabled` → **EXEMPT_RULE_KEYS with a written rationale.** STANDS, chair-gated.

Re-read at `5d6a0e7c`: `runSpatialCanonize` (`src/store/campaignSpatialCanonize.js:75`)
sets `biomeTexture` into `buildSpatialDigest`. It is on the **STORE CANONIZE path,
not the pulse path** — a canon-freeze option adding a `biomes` key to a digest
authored ONCE and never recomputed. Its own header at `:69-72` says *"Absent ⇒
biomeTexture false ⇒ NO biomes key ⇒ byte-identical."* No soak receipt reaches it;
the whole-world soak never calls `runSpatialCanonize`; it has no per-tick aliveness
to certify. It matches `routineMajorApproval`'s exemption reasoning in structure.

**Counter-argument, recorded rather than suppressed: it DOES change persisted
bytes**, which `routineMajorApproval` does not. That is why this is chair-gated. If
the chair refuses the exemption, D-4 becomes a manifest entry with a
canon-golden-backed row — and it would then have to clear §4.3's cohort contract,
which it does (`grep -c candidateType src/store/campaignSpatialCanonize.js` → **0**).

Whichever the chair picks, the rationale must clear the walker's
`toBeGreaterThan(120)` review floor at `:559`.

### 4.3 ⛔⛔ D-2 AND D-3 ARE REFUSED AS DRAFTED — a landed contract forbids the row

This is Lane G2's material finding and it does not appear in Lane G1's draft.

`tests/domain/subsystemRowsVirtual.test.js` (SHA-256 `2c0341e1…`, 561 lines) holds a
**closed cohort claim** over `VIRTUAL_RULES` — the frozen 16-member list at `:129`,
asserted order-exact against `VIRTUAL_SUBSYSTEM_ROWS.map(row => row.rule)` at `:305`
and sorted-equal against `ENGINE_GATED_VIRTUAL_RULE_KEYS` at `:310`. Its arm at
`:469-484`, verbatim:

```js
test('the empty-eventTypes claim holds: no lane leaf mints a candidate', () => {
  for (const rule of VIRTUAL_RULES) {
    expect(rowFor(rule).aliveness.eventTypes, `${rule}: the row declares no candidate vocabulary`).toEqual([]);
    for (const leaf of LANE_LEAVES[rule]) {
      …
      expect(
        file.src.includes('candidateType'),
        `${rule}: ${leaf} now names candidateType — declare the literal in the row's eventTypes`,
      ).toBe(false);
    }
  }
});
```

**Executed at `5d6a0e7c`:**

```
2  candidateType  src/domain/worldPulse/institutionLifecycle.js
0  candidateType  src/domain/worldPulse/settlementPolitics.js
0  candidateType  src/store/campaignSpatialCanonize.js
5  candidateType  src/domain/worldPulse/convergence.js
0  candidateType  src/domain/worldPulse/supplyWebWarfare.js
```

`institutionLifecycle.js:752` spells `candidateType: 'institution_build'` and `:821`
spells `candidateType: 'institution_closure'`.

**Both of D-2's and D-3's gates live in `institutionLifecycle.js`, and it is their
only lane leaf** — the gate is where the flag is read, and it is read at `:661` and
`:665` of that file. So joining `VIRTUAL_RULES` reds the cohort test **in a pincer**:

- declaring `eventTypes: []` reds the **leaf arm** (the leaf names `candidateType`);
- declaring `eventTypes: ['institution_build']` — the honest declaration, since the
  flag really does open a gap candidate that becomes an institution — reds the
  **`toEqual([])` arm**, which is unconditional over every `VIRTUAL_RULES` member;
- omitting the `LANE_LEAVES` entry throws `TypeError` on `for (const leaf of undefined)`.

There is no spelling of a virtual row for these two keys that leaves
`tests/domain/subsystemRowsVirtual.test.js` green. ⛔ **A red here is refused by this
packet's own STOP conditions and by the walker-row reservation rule (§5.2): a
failing enforcement walker is a disabled guard, never bankable debt.**

⭐ **RULED — §32 ruling 1 takes door (a) for `underwaysOrganicFoundingEnabled` and
door (b) for `institutionPoliticalControlEnabled`, exactly Lane G2's recommended
split.** ⚠ Door (a) is taken with ONE correction to its literal predicate, forced
by live code and recorded in full at §13.2: the widened contract asserts declared
`eventTypes` against the SEPARABLE literals, not against every literal the leaf
mints. `institution_build` is minted from the top-affinity gap across every gap
source and is ALREADY declared by `institutionLifecycleEnabled`'s row, so
declaring it here would grade this row ALIVE off another subsystem's traffic —
precisely what `:460-466` already forbids for a shared container.

**The two doors as Lane G2 framed them (**OQ-G2-1**, now ruled):**

**(a) WIDEN THE COHORT CONTRACT — Lane G2's recommendation.** The three claims
(empty `eventTypes`, empty `moverFamilies`, no-`candidateType` leaves) are *measured
facts about the first sixteen rows*, not laws. The honest cure partitions
`VIRTUAL_RULES` into zero-candidate and candidate-bearing subsets and asserts the
DECLARED `eventTypes` set **equals** the literals its leaves actually mint —
strictly stronger than asserting emptiness, and it preserves the arm's real purpose
(the comment's own words: *"under-claiming rots exactly like over-claiming"*).
**Cost: one more handwritten file, taking the total 4 → 5.** Chair-gated because it
re-shapes a landed certification claim.

**(b) EXEMPT BOTH.** Cheapest, and Lane G2 refuses it for `underwaysOrganicFoundingEnabled`.
That flag writes a real container — `evaluateInstitutionLifecycle` at `:661` threads
`underwaysFoundingLit` into `detectInstitutionGaps(settlement, chains, { underwaysFoundingLit })`
at `:722`, where `:429` opens an additional gap candidate at village tier and above,
which becomes an institution. `tests/domain/worldPulseLitBurndown.test.js:154`
already carries an `E-H flag lit` block for it. Exempting it is exactly the shrug
the exemption arm's own comment names: *"a shrug is how a real subsystem escapes
certification wearing a policy's clothes (R19)."*

**`institutionPoliticalControlEnabled` is the softer case and (b) is defensible for
it alone.** It gates `const controlSets = politicalControlLit ? factionControlSets(settlement) : null;`
at `:791`, and its own comment states the effect exactly: *"Dark ⇒ closure ranking
ignores controlled/suppressed ⇒ byte-identical."* It modifies an existing ranking and
writes no container of its own. An exemption with a written rationale is honest here
in a way it is not for D-2.

**Lane G2's recommended split: (a) for `underwaysOrganicFoundingEnabled`, (b) for
`institutionPoliticalControlEnabled`.** That buys the cohort widening only where a
real container forces it, and keeps the exemption list honest.

### Disposition summary

**All four are RULED by §32; the column records the ruling, not a proposal.**

| Key | Disposition | Ruling |
|---|---|---|
| `settlementPoliticsEnabled` | MANIFEST + populated virtual row | criteria met on the record; cohort contract clears |
| `underwaysOrganicFoundingEnabled` | MANIFEST + row, **with the §4.3(a) cohort widening as corrected by §13.2** | §32 ruling 1, door (a) |
| `institutionPoliticalControlEnabled` | EXEMPT with written rationale | §32 ruling 1, door (b) |
| `biomeTruthEnabled` | EXEMPT with written rationale (canon-freeze option, not a subsystem) | §32 ruling 5 |
| `factionCompetitionEnabled`, `interventionEnabled`, `supplyWebWarfareEnabled` | none — already in the census | not gated |

**Resulting figures: `ENGINE_GATED_VIRTUAL_RULE_KEYS` 16 → 18, `EXEMPT_RULE_KEYS`
1 → 3, `BACKLOG_RULE_KEYS` 17 → 17 (never touched).**

---

## 5. Census law and the figures that move

**Preamble §P3 governs.** INFRA has no standing census tuple; this member derives
its own.

### 5.1 ⭐ THE PACKET IS CENSUS-NEUTRAL AS DESIGNED

The lighting census (`tests/lint/sovereigntyLightingContract.walker.test.js:4108`,
SHA-256 `3311b41e…`) reduces `titles` and `suiteTitles` over the **credited** files'
**literal `it` / `describe` titles**, and counts `files` as `TEST_FILES.length`.

This packet:

- **creates no test file** → `files` **+0**, and §P4's enumeration law is satisfied
  trivially: no new file can be picked by `enumerateInvariants()`, so no
  `scripts/mutation-coverage-manifest.json` row is owed and the standing
  never-re-serialize law is untouched;
- **adds no literal `test(...)` or `describe(...)` title** → `titles` **+0**,
  `suiteTitles` **+0**. §7's positive and negative controls are additional
  assertions **inside the existing test bodies** at `:465-480` (`the live scan is
  non-vacuous…`) and `:366-380` (`guard the guard: the scanner sees code and only
  code`);
- **changes no file's registration shape** → `parked` **+0**, `credited` **+0**. The
  edit adds no `.each`, no conditional or looped registration, no nested describe,
  no `skip`/`todo` — each of which parks a file WHOLE under §P3 rule 2.

**Predicted tuple: `2418/366/2052/20024/5643` — UNCHANGED, `+0/+0/+0/+0/+0`.**

⛔ **This is a hard packet constraint, not an observation.** If the implementation
adds even one literal title, the tuple moves and the packet takes the reservation it
is designed not to take. §10 makes that a STOP.

### 5.2 The J-TE3-1 declaration (ODQ §31 ruling 3 — LAW)

ODQ §31 ruling 3: *"census-moving members declare the lighting-walker interior red
BY FIGURE in the train plan, or the plan is defective."*

**This member is census-neutral, so it declares NO interior red, and the declaration
is that there is none: the tuple `2418/366/2052/20024/5643` is expected to hold
byte-identically at the member's own commit.** Preamble §P3's interior-red paragraph
does not fire.

⚠ **If the chair takes OQ-G2-2's alternative** (three new titles), the declaration
becomes mandatory and reads: the lighting walker reds at this member's own commit
with `expected 20027 to be 20024`, one figure, one arm, cured by the re-record in the
same commit; and the packet then TAKES the estate-wide reservation and must be
sequenced against every other reservation-taking wave.

### 5.3 ⛔ CORRECTION TO LANE G1 §5.1 — the reservation blocker was never real

Lane G1's §5.1 asserted *"This packet adds test titles … so it DOES take it"* and
concluded the packet was **BLOCKED** on GR-4b-iii-b's held reservation (its OQ-G3).
That was G1's own internal contradiction: its §7 places every new control **inside
existing tests**, which adds no title. Under the counting rules re-read at
`5d6a0e7c`, the packet is census-neutral and the blocker dissolves.

The point is moot at this base anyway — **GR-4b-iii-b LANDED** (`770167c5`), the
gr-4b-ii train landed (`60083174`) and the infra-1 train landed (`5d6a0e7c`). INDEX
records **"the census is FREE"** and **zero dispatchable packets**. But the shape
matters for the next restamp, so the correction is recorded rather than left to be
re-derived.

### 5.4 The figures that DO move

**The serialization law binds: every figure that moves is re-derived WHOLE in the
same change, never patched.**

| Figure | At `5d6a0e7c` (executed) | After (D-1 manifest; D-2 manifest under §4.3(a); D-3 + D-4 exempt) |
|---|---:|---:|
| `GATE_RE` measured keys | 63 | **70** |
| `ENGINE_GATED_VIRTUAL_RULE_KEYS` | 16 | **18** |
| `VIRTUAL_RULES` (`subsystemRowsVirtual.test.js:129`) | 16 | **18** |
| `VIRTUAL_SUBSYSTEM_ROWS` | 16 | **18** |
| `simulationRuleKeys()` census | 73 | **75** |
| `SUBSYSTEM_CERTIFICATION_REGISTRY` rows | 72 | **74** |
| `EXEMPT_RULE_KEYS` | 1 | **3** |
| `BACKLOG_RULE_KEYS` | 17 | **17 — UNCHANGED. Never touched. Never raised.** |
| `SUBSYSTEM_CERTIFICATION_PENDING_KEYS` | 1 | **1 — unchanged** |
| lighting census tuple | `2418/366/2052/20024/5643` | **unchanged (§5.1)** |
| capsule `flagManifestRows` | 16 | 18 — the artifact goes STALE by design |
| non-vacuity floor `readKeys.length >= 40` at `:470` | 63 | 70 — the floor stays 40; it is a collapse detector, not a ceiling |

⚠ **The header comment is at `:467`, not `:471`** (Lane G1's address is four lines
high — hand-keyed-address rot). It reads *"The floors sit under today's measurement
(51 keys across the tree)"* while the executed measurement is **63**. Already stale
at this base; the packet corrects it to the re-derived figure in the same change that
moves it.

⚠ **The capsule is not a gate.** `tests/scripts/baseStateCapsule.test.js` runs the
generator against a canned shell and compares against home-derived values
(`flagManifestRows: rules.ENGINE_GATED_VIRTUAL_RULE_KEYS.length`, `stampedAt:
'feedface'`), so a manifest change reds nothing there. `docs/implementation/BASE_STATE.json`
simply stops matching HEAD, which the consumption law already handles: a capsule
stamped at another sha is worthless for citation and the next compiler measures from
scratch. The packet does **not** regenerate it; the next exposure does.

⚠ **No absolute literal pins 16 / 72 / 73.** Every downstream count assertion is
relative (`audit.covered + audit.pending === simulationRuleKeys().length` in four
files; `evaluation.rows.length === SUBSYSTEM_CERTIFICATION_REGISTRY.length`), so they
re-derive. Executed by grep across `tests` and `src`.

**Downstream figures the coordinator must re-derive, not inherit:** the soak design's
L1 / L2 / L2′ lit counts (computed off the 73-key census) and the aliveness table's
row count (72 → 74).

### 5.5 The walker-row reservation rule

A failing walker may never be banked as ordinary debt. `tests/lint/testRatchet.test.js`
enforces it: any enforcement-walker row in the test census must sit in
`WALKER_ROWS_ADMITTED` (ceiling **4**) or `WALKER_ROWS_OWED` (ceiling **9**), both
LITERAL and monotone-down, and the pin's own message says *"and raise no ceiling to
do it."* **Therefore the widened walker MUST land GREEN in the same commit as its
dispositions.** A red-then-ledger landing is refused by construction. This is the
single hardest constraint in the packet and it is why §4's dispositions and §3's
detector are one commit, not two.

---

## 6. Hazard registry — a WIDENING, not a mint

**The cure widens an EXISTING class: `HZ-CAMELBLIND`.** Re-read at `5d6a0e7c` from
`scripts/hazard-registry.json` (SHA-256 `bf4e8098…`): title *"A `\bicon` guard cannot
see resourceIcon/needIcon — the guard exists and is BLIND"*, status **PARTIAL**,
instances **2**, enforcer paths `["tests/lint/copyCorruption.test.js"]`, and this
`upgradePath` verbatim:

> The general shape — 'a source-scan guard whose regex is narrower than its stated
> claim' — deserves a META-WALKER that compares each guard's stated claim against
> the population its regex can actually reach.

`GATE_RE` is a source-scan guard whose regex is narrower than its stated claim. This
is instance **3**. The packet sets `instances` 2 → 3, extends `instanceEvidence` with
the executed 63 → 70 measurement, and adds
`tests/lint/engineGatedRuleKeys.walker.test.js` to `enforcer.paths`. **Status stays
PARTIAL** (no meta-walker is built here), so no status count moves.

### 6.1 What a NEW class would have cost

Executed at `5d6a0e7c`:

```
classes = 29;  TALLY {"DOCUMENT":6,"PARTIAL":11,"MACHINERY":12}
baselines {documentBaseline: 6, owedBaseline: 18, machineryFloor: 9, classFloor: 27}
owedCount (DOCUMENT + PARTIAL) = 17
registry measuredAtSha bd5e49f6 (2026-08-07)
```

Arm **G** of `scripts/check-hazard-registry.mjs` is a status ratchet: DOCUMENT
shrink-only, DOCUMENT+PARTIAL ("owed") shrink-only, MACHINERY grow-only. DOCUMENT
sits at **6 / 6** and owed at **17 / 18**.

- A new class minted as DOCUMENT **reds immediately** (`6 → 7 > 6`).
- A new class minted as PARTIAL fits **the single remaining owed slot**, spending the
  estate's last one on a duplicate of an existing class.
- A new class at MACHINERY escapes both ratchets but requires arm C (≥1 named
  enforcer), arm D (every named path exists on disk) and arm F (`inChain` re-derived
  from `package.json`'s `check` chain) — i.e. it requires the meta-walker to already
  exist on disk and in the chain.

**JUDGMENT (vetoable): widen HZ-CAMELBLIND rather than mint.**

### 6.2 The rest of the governance substrate does not move

`documentBaseline`, `owedBaseline`, `machineryFloor`, `classFloor`, the pre-mortem
counts, `uncoveredBaseline`, the OSR figure and every ratchet baseline stay exact.
⚠ **`scripts/hazard-registry.json` — the coordinator confirms whether editing it
trips the OSR schema-mint law before dispatch** (the recorded law is that eleven
governed paths throw on `--write`). Lane G2 did not test this; it requires a
`--write`, outside a draft lane's authority. **OQ-G2-4.**

### 6.3 Blast radius of touching the walker file — RE-DERIVED

`tests/lint/engineGatedRuleKeys.walker.test.js` (SHA-256
`14cd4edf7ebd65050acdcd67f77d48bea7ba950e09a3618d413c5f155ae06ed5`, 612 raw / 334
effective) is an **imported module**. Re-derived at `5d6a0e7c`: **exactly ten files
import `codeOnly` from it.**

```
tests/domain/brokerageIntercept.test.js:61
tests/domain/strategicPosture.test.js:43
tests/lint/postureNameCollision.walker.test.js:44
tests/property/believedWorldAxesDormancyFence.test.js:53
tests/property/casusCommerciiDormancyFence.test.js:45
tests/property/errandSpineDormancyFence.test.js:54
tests/property/espionageDormancyFence.test.js:63
tests/property/espionageMissionDormancyFence.test.js:53
tests/property/secrecyTradeDormancyFence.test.js:57
tests/property/strategicPostureDormancyFence.test.js:52
```

⛔ **`codeOnly` MUST NOT CHANGE.** Its export signature and behavior are frozen by
this packet.

Two further files name the walker **by path but import nothing from it** —
`tests/lint/testRatchet.test.js:632` (which records that the ten importers are
deliberately excluded from the walker classifier — that clause must keep holding
after the edit) and `tests/lint/tradeConvergenceContract.walker.test.js:32,:139`
(prose). ⚠ Lane G1's draft said *"Eight files import `codeOnly`"* and then listed
ten, two of which were these non-importers. The corrected list is above.

⚠ `tradeConvergenceContract.walker.test.js` **does** import
`ENGINE_GATED_VIRTUAL_RULE_KEYS` (`:71`) and joins it against `FP_PROGRAM` rows at
`:478-509`. Executed: none of the four keys appears in
`src/domain/certification/tradeConvergenceContract.js` (`grep` exit 1), so the join is
unaffected. The `built` array is asserted non-empty and grows, never shrinks.

---

## 7. Mutant plan

Every mutant obeys the **plant-nothing-greens rule** (preamble §P6): each records the
target file's SHA-256 before and after the plant, **asserts the bytes actually
changed** (a no-op plant is `BROKEN`, never `CAUGHT`), captures exactly one physical
`FAIL ` line whose tail is the intended full title, and restores the file
digest-exact in the same shell. Exit codes captured in-shell with `; echo
TRUE_EXIT=$?`, never through a pipe.

⛔ **THE PLANT TARGET IS NAMED, AND IT IS NOT ARBITRARY.** Lane G1 left M1-M3's
target as *"one named `src/domain/worldPulse/*.js` leaf"*. §2.4 measured why that
cannot be left open: `convergence.js` has **2** effective lines of headroom and
`institutionLifecycle.js` has **16**, so a multi-line plant into either reds
`max-lines` for a reason that has nothing to do with the mutant.
**M1-M4 plant into `src/domain/worldPulse/supplyWebWarfare.js` (537/800, 263 lines of
headroom).** M5 must use `convergence.js` because that file's six rebindings of `r`
are the guard's subject — so **M5 is a strict one-line-for-one-line plant**, and the
restore is verified by digest, not by line count.

| # | Plant | Target | Must red BY NAME |
|---|---|---|---|
| **M1** | Shape A. Insert `const g2a = /** @type {Record<string, unknown>} */ (rules); if (g2a.mutantAliasProbeEnabled === true) return null;` inside an existing rules-bearing function | `supplyWebWarfare.js` | `the manifest holds against the tree in BOTH directions`, `unaccountedReads: mutantAliasProbeEnabled` |
| **M2** | Shape B. Insert `const g2b = (context.simulationRules \|\| {}).mutantExprProbeEnabled === true;` | `supplyWebWarfare.js` | same test, `unaccountedReads: mutantExprProbeEnabled` |
| **M3** | Shape C. Insert `const g2cRules = worldState?.simulationRules \|\| {}; const g2c = g2cRules.mutantRenamedProbeEnabled === true;` | `supplyWebWarfare.js` | same test, `unaccountedReads: mutantRenamedProbeEnabled` |
| **M4** | **NEGATIVE — the config false positive.** Insert `const g2cfg = { }; const g2d = g2cfg?.mutantConfigProbeEnabled === true;` | `supplyWebWarfare.js` | **the walker must STAY GREEN.** A red means the detector admits non-rules receivers and re-opens §2.2 rows 8-10 |
| **M5** | **NEGATIVE — the scope collision (guard 2).** One-line-for-one-line: after the rules alias `r` at `:226` and inside a different block, plant `const r = { }; const g2e = r.mutantScopeProbeEnabled === true;` | `convergence.js` (which really does rebind `r` at `:226, :434, :508, :801, :1062, :1286`) | **must STAY GREEN.** A red proves the nearest-binding rule regressed to a file-wide alias set |
| **M6** | **DETECTOR REGRESSION — arm 3.** Delete arm 3 | the walker itself | `the live scan is non-vacuous and reaches BOTH gate spellings`, naming `settlementPoliticsEnabled` / `biomeTruthEnabled` |
| **M7** | **DETECTOR REGRESSION — arm 2.** Delete arm 2 | the walker itself | same test, naming `underwaysOrganicFoundingEnabled` / `institutionPoliticalControlEnabled` |
| **M8** | **GUARD 1 REGRESSION.** Remove the trailing `\b` from the receiver alternation | the walker itself | `guard the guard: the scanner sees code and only code`, naming `revealed` or `isGoverning` |

M1-M3 prove direction B is real. M4-M5 prove the false-positive floor is real — they
are the arms that stop this widening from becoming its own blindness in the opposite
direction. M6-M8 are the anti-vacuity arms: a future simplification of the pattern
reds **here** rather than silently re-blinding the census.

⚠ **M6, M7 and M8 convict titles that already exist** (§5.1 keeps the packet
census-neutral, so no new title is minted). M6 and M7 share one title and are
distinguished by their assertion messages, which name different keys. That is
admissible — the infra-1 and gr-4b-ii receipts both record a mutant convicted by more
than one case — but it must be stated, not discovered. If the chair takes OQ-G2-2's
alternative, each gets its own title and its own identity.

### 7.1 The controls, and where they go

**Positive controls, appended INSIDE `the live scan is non-vacuous and reaches BOTH
gate spellings` (`:465-480`)**, alongside today's `warLayerEnabled` /
`seaRoadsEnabled` / `economicCoupReadEnabled`:

```js
expect(readKeys).toContain('settlementPoliticsEnabled');        // arm 3, alias
expect(readKeys).toContain('underwaysOrganicFoundingEnabled');  // arm 2, expression
expect(readKeys).toContain('biomeTruthEnabled');                // arm 3, renamed local
```

One per new arm, so an arm cannot be deleted silently. The test's own title must be
re-worded from *"BOTH gate spellings"* to name the widened set, since the count is no
longer two — and that re-wording **changes a literal test title**, which §5.1 forbids.
⛔ **Therefore the title is left EXACTLY as it stands and the widening is explained in
the test's leading comment instead.** This is the one place where census neutrality
costs a small amount of legibility, and it is recorded rather than smoothed away.

**Negative controls, appended INSIDE `guard the guard: the scanner sees code and only
code` (`:366-380`)** — the three decoys from §2.2 rows 8-10 in their real spellings
(`config?.`, `options?.`, `args.`), plus `return leash.revealed === true` and a
rebound short name. Today's test asserts an exact array with
`expect(found).toEqual([...])`; **the packet extends that array rather than replacing
the assertion style.**

### 7.2 ⭐ ODQ §31 ruling 2 — the un-anchored-negative PREFLIGHT

ODQ §31 ruling 2 is LAW: *"every new acceptance file runs the negative-assertion
anchor walker focusedly BEFORE its member proof is declared green."* Both §28 trains
red their first terminal gate on exactly this class.

**This packet inherits the rule even though it creates no file**, because it adds
assertions to a file whose ceiling is **ZERO**. Executed at `5d6a0e7c`:

- `tests/lint/engineGatedRuleKeys.walker.test.js` has **no row** in
  `FROZEN_UNANCHORED_NEGATIVES` and none in `READMITTED_GENERATION_FACING`, so
  `ceilingFor(file)` returns **0** (`negativeAssertionAnchor.walker.test.js:728`);
- the file today contains **zero** bare negatives
  (`grep -n 'not\.\(toContain\|toMatch\|toHaveProperty\)('` → exit 1);
- the inventory arm's own instruction is *"never add a file"*.

⛔ **A single bare `not.toContain` / `not.toMatch` / `not.toHaveProperty` added to
this file reds `no NEW un-anchored negative assertion anywhere in the test corpus`
immediately.** §7.1's exact-array `toEqual` extension is safe by construction. Any
absence stated separately must use `expectAbsentWithAnchor` from
`tests/helpers/anchoredNegatives.js`, or the boolean form the file **already uses as
its own precedent** at `:583-598`:

```js
expect(readKeys.includes(key), '…').toBe(false);
```

with the accompanying note explaining why the assertion cannot go vacuous — the
idiom that file's own comment describes as *"stated as booleans rather than as bare
collection negatives."*

**MANDATORY PREFLIGHT, before the member proof is declared green:**
`npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js`, exit captured
in-shell with `; echo TRUE_EXIT=$?`, never piped.

---

## 8. Residuals, stated as residuals

1. **The frozen-list conjunction** (`REQUIRED_RULES.every((key) => rules[key] === true)`)
   the walker's header names remains unresolved. **Zero live instances measured at
   `5d6a0e7c`**, so a guard for it would be a pin over an empty population. The
   header's `:177-186` paragraph must be **REWORDED, not deleted**: the class it
   names is real and merely dormant.
2. **Scope resolution is textual, not lexical.** Nearest-preceding-binding is a sound
   approximation, not a parser. A rules alias bound inside a closure and read after a
   same-named rebinding in a sibling closure could still mis-attribute. Zero live
   instances; M5 is its detector.
3. **Non-`Enabled` flag names on non-canonical receivers** are unreachable by arms 2
   and 3 by design (guard 3). `routineMajorApproval` is the only such key today and
   it is read canonically.
4. **`src/` only.** `scripts/` and `api/` are outside the walk, as they are today.
5. **`convergence.js` at 798/800** is a hot file by PACKET_STANDARD's own definition
   and is absent from the standing list. This packet does not add it (a coordinator
   act) but records the measurement that would. **OQ-G2-3.**

---

## 9. Change manifest (coordinator to finalize)

| Action | Path | SHA-256 at `5d6a0e7c` | Region | Δ | Instruction |
|---|---|---|---|---:|---|
| TEST | `tests/lint/engineGatedRuleKeys.walker.test.js` | `14cd4edf…` | `GATE_RE` `:243`; `scanGateReads` `:260-274`; `EXEMPT_RULE_KEYS`; header `:177-186`; comment `:467`; tests at `:366-380` and `:465-480` | ≤ 90 | Add arms 2 and 3 with all three guards; add the ruled EXEMPT keys with their rationales (each > 120 chars, `:559`); extend the positive and negative controls per §7.1; reword the recorded class from *frozen-list conjunction* to *non-canonical receiver*; correct the stale `51 keys` comment to 70. ⛔ **`codeOnly` `:196-236` unchanged. No literal test or suite title changed.** |
| MODIFY | `src/domain/worldPulse/simulationRules.js` | `16f2dc7b…` | `ENGINE_GATED_VIRTUAL_RULE_KEYS` `:185` | ≤ 20 | Add the ruled keys with joined-by comments, in the list's existing annotated style. 302/800 effective — 498 lines of headroom. |
| MODIFY | `src/domain/certification/subsystemRowsVirtual.js` | `ff34962a…` | `VIRTUAL_SUBSYSTEM_ROWS` | ≤ 115 | Author the ruled rows. Measured headroom **493/800 effective — 307 lines**. Not a hot file. ⚠ Per-row cost re-measured from the 16 landed rows: **mean ≈ 51 raw lines**, so two rows ≈ 102 raw. Lane G1's "≤ 90 for three rows" was low by roughly half. Each row owes `aliveness.other.length > 400`, ≥ 1 invariant with non-empty `name` and `check`, a valid `expectedTempo` and `soakEvidence`, and every `module` path must exist on disk. |
| **TEST** | **`tests/domain/subsystemRowsVirtual.test.js`** | `2c0341e1…` | `VIRTUAL_RULES` `:129`, `LANE_LEAVES` `:143` | ≤ 25 | ⭐ **MISSING FROM LANE G1'S MANIFEST.** `VIRTUAL_RULES` is a frozen 16-member list asserted **order-exact** against `VIRTUAL_SUBSYSTEM_ROWS.map(row => row.rule)` at `:305` and **sorted-equal** against the manifest at `:310`. Every new manifest key needs a `const` binding, a `VIRTUAL_RULES` entry **in authoring order** (not alphabetical), and a `LANE_LEAVES` entry — an omitted `LANE_LEAVES` key throws `TypeError` at `:472`. |
| REGISTER | `scripts/hazard-registry.json` | `bf4e8098…` | `HZ-CAMELBLIND` | — | `instances` 2 → 3; extend `instanceEvidence` with the executed 63 → 70 figures; add the walker to `enforcer.paths`. Status stays `PARTIAL`. |
| **TEST** | `tests/domain/subsystemRowsVirtual.test.js` | — | `:469-484` | ≤ 40 | ⭐ **RULED IN by §32 ruling 1 (door a).** Partition the empty-eventTypes claim into a zero-candidate cohort and a candidate-bearing one. The zero-candidate arm keeps today's exact claim unchanged. The candidate-bearing arm asserts, per rule, that the declared `eventTypes` equals the SEPARABLE literals and that every literal its leaves mint is either declared or carries a written shared-literal reason (§13.2). |
| DOC | `docs/implementation/INDEX.md` | — | the measurement block + the GAP-1 row | — | Coordinator act at promotion and at landing. |
| DOC | `docs/implementation/PACKET_MANIFEST.json` | — | the `packets` array | — | Coordinator act at promotion: one appended row in the file's exact existing style. Never a whole-file re-serialization. |
| **DOC** | `docs/implementation/PACKET_STANDARD.md` | — | the `## Hot files` table | — | ⭐ **§32 ruling 3.** `src/domain/worldPulse/convergence.js` joins the standing hot-file list at its executed **798/800** measurement (§2.4). It outranks two current members in tightness. |

**Not in the manifest, deliberately:** `src/domain/worldPulse/institutionLifecycle.js`
(784/800), `src/domain/worldPulse/convergence.js` (**798/800**),
`src/domain/worldPulse/settlementPolitics.js`,
`src/domain/worldPulse/supplyWebWarfare.js`, `src/store/campaignSpatialCanonize.js`,
`docs/implementation/BASE_STATE.json` (§5.4). ⛔ **No gate site is edited.** The
detector changes; the engine does not. **Any edit to a gate site is a STOP.**

**Handwritten files: 4** (5 if the chair takes §4.3(a)). **Production files modified:
2.** Within every default hard scope limit (≤ 12 handwritten, ≤ 3 existing
logic-bearing production files, ≤ 400 new/changed effective production lines).

---

## 10. Mandatory STOP conditions (additional to PACKET_STANDARD's and preamble §P8)

- ⭐ The five OQs are DISCHARGED by §32 (§13). The two STOPs they carried are
  retired; every STOP below still binds.
- **The implementation adds any literal `test(...)` or `describe(...)` title** —
  §32 ruling 2 signs the packet census-NEUTRAL, so §5.1 is a ruled contract, not a
  hope, and the tuple `2418/366/2052/20024/5643` must hold byte-identically.
- ⛔ **Any governed observed-shape scanner path would move** (INFRA-PREAMBLE §P2,
  §P8.5, and §32 ruling 4's conditional). Verified NEGATIVE before the first edit:
  `scannerToolFiles()` returns eleven paths and this manifest intersects them in
  **zero** places, so no schema mint is owed. A later manifest growth that touches
  one of the eleven re-charters the wave onto the mint docket.
- **Any bare `not.toContain` / `not.toMatch` / `not.toHaveProperty` is added to
  `tests/lint/engineGatedRuleKeys.walker.test.js`** — its anchor ceiling is ZERO
  (§7.2).
- The widened walker cannot be made green **in one commit** — STOP, do not ledger the
  red. A failing enforcement walker is a disabled guard, never test debt (§5.5).
- `tests/domain/subsystemRowsVirtual.test.js` reds on the empty-eventTypes,
  empty-moverFamilies, or lane-leaf arms (§4.3).
- `BACKLOG_RULE_KEYS` would need a new row, or its ceiling would need raising.
- `codeOnly` would need to change, or any of the ten importers (§6.3) would need to.
- The direction-A proof shows any `LOST` key.
- Any mutant M4 or M5 reds.
- Any file in §9's *not in the manifest* list is edited.
- A `max-lines` red appears on `convergence.js` or `institutionLifecycle.js` — the
  plant went to the wrong target (§7).

---

## 11. Open questions the chair must rule BEFORE dispatch

**OQ-G2-1 — D-2 and D-3 under the cohort contract (§4.3).** Widen
`tests/domain/subsystemRowsVirtual.test.js`'s empty-eventTypes claim (a 5th
handwritten file, a re-shaped landed certification claim), or exempt both keys.
**Lane G2 recommends the split: widen for `underwaysOrganicFoundingEnabled` (it
writes a real container), exempt `institutionPoliticalControlEnabled` (it modifies an
existing ranking and is byte-identical when dark).** ⛔ This is the packet's REFUSAL
and it did not exist in Lane G1's draft.

**OQ-G2-2 — census neutrality, or three new titles?** §5.1 designs the packet
census-neutral, which costs the M6/M7 identity split and one test title's legibility
(§7.1). The alternative mints three titles, moves the tuple to
`2418/366/2052/20027/5643`, takes the estate-wide reservation, and triggers the
J-TE3-1 declaration (§5.2). **Lane G2 recommends neutrality:** the reservation is a
scarce estate resource and the identity cost is small and stated.

**OQ-G2-3 — does `src/domain/worldPulse/convergence.js` join PACKET_STANDARD's
hot-file list?** Measured **798/800 effective, 2 lines of headroom**, no size-baseline
entry, no door — hotter than two of the three files already listed. Adding a row is a
coordinator act requiring an executed measurement; §2.4 is that measurement.

**OQ-G2-4 — does editing `scripts/hazard-registry.json` trigger an OSR schema mint?**
The recorded law is that eleven governed paths throw on `--write`. Lane G2 did not
test this — a `--write` is outside a draft lane's authority. The coordinator confirms
before dispatch.

**OQ-G2-5 — D-4's exemption, or a row?** `biomeTruthEnabled` changes persisted bytes,
which `routineMajorApproval` does not. If the chair refuses the exemption it becomes a
manifest entry with a canon-golden-backed row; it clears the §4.3 cohort contract
(`candidateType` count 0), so unlike D-2 that door is genuinely open.

---

## 12. What Lane G2 did NOT do

- **Ran no vitest suite.** §4's predicted red is PLAUSIBLE, not CONFIRMED.
- **Did not measure the five-figure lighting census by running it.** The recorded law
  is *never census a live shared tree*. §5.1's `+0` prediction is derived from the
  walker's own counting rules re-read at `5d6a0e7c`, not from an executed census.
- **Did not test the OSR mint trigger** (OQ-G2-4) — it requires a `--write`.
- **Did not implement the widened walker in the tree.** The prototype lives only in
  the lane scratchpad, which is where every executed figure came from.
- **Wrote no tracked file, staged nothing, committed nothing.**

---

## 13. THE CHAIR'S §32 RULINGS, AND THE ONE CORRECTION LIVE CODE FORCED

### 13.1 The five OQs, discharged

| OQ | Ruling (`OWNER_DECISION_QUEUE.md` §32, 2026-08-14, chair, vetoable) |
|---|---|
| **OQ-G2-1** | **The REFUSED-IN-PART split is ACCEPTED.** The closed-cohort pincer at `subsystemRowsVirtual.test.js:469-484` is real. Cohort WIDENED for `underwaysOrganicFoundingEnabled` (a real container writer); EXEMPTION ROW with a written reason for `institutionPoliticalControlEnabled` (ranking modifier, byte-identical dark) — the hazard-conversion law's exempt-with-reason arm. |
| **OQ-G2-2** | **SIGNED — census-neutral.** Per J-TE3-1 the plan declares NO census interior red; the tuple `2418/366/2052/20024/5643` holds byte-identically. |
| **OQ-G2-3** | **`convergence.js` (798/800, measured) JOINS THE STANDING HOT-FILE LIST** in this landing's docs flip. Any packet touching it opens with an executed headroom measurement. |
| **OQ-G2-4** | **Conditional.** If the widened detection lives entirely in the walker test file, no OSR mint is owed; if ANY governed scanner path moves, the executor STOPs. **Verified before the first edit: zero of the eleven `scannerToolFiles()` paths intersect this manifest. No mint owed.** |
| **OQ-G2-5** | **D-4's exemption ACCEPTED** with its written reason, same arm as ruling 1. |

The six G2 judgments are RATIFIED on the report's receipts, and the §31 anchor
preflight is mandatory: the walker file has ZERO anchor-inventory rows, so one bare
`not.toContain` reds it.

### 13.2 ⛔ THE CORRECTION — §4.3(a)'s literal predicate is refuted by live code

§4.3(a) as drafted asks the widened arm to assert that a candidate-bearing lane's
declared `eventTypes` **equals the literals its leaves actually mint**. Executed at
`5d6a0e7c`, three independent facts refuse that spelling for the one key it governs:

1. **`institution_build` is a SHARED literal.** `institutionLifecycle.js:752` mints
   it from `gaps[0]` — the top-affinity member of a set fed by downstream chains,
   resource needs, and martial emergence weighting. The flag opens exactly ONE
   additional gap (`:429`, `via: 'underways'`), and only when that gap wins the
   sort. `institution_closure` (`:821`) is not on this flag's path at all.
2. **It is ALREADY DECLARED** by `institutionLifecycleEnabled`'s own registry row
   (executed: that is the only row declaring it). A second declarant would let two
   rows grade ALIVE off one channel.
3. **The escape hatch is FULL.** A row that declares a channel and still says
   `soakEvidence: 'unobserved'` joins the population `UNOBSERVED_OVERRIDE_CEILING`
   caps at **5**, and it sits at exactly 5 today (`faithSpreadEnabled`,
   `religionDynamicsEnabled`, `interventionEnabled`, `traditionsEnabled`,
   `reframeEnabled`). That ceiling is SHRINK-ONLY and its own comment refuses a
   raise "to admit a new row that would rather not be called SILENT".

Declaring the minted literals would therefore mint a FALSE aliveness claim — the
exact failure `subsystemRowsVirtual.test.js:460-466` already forbids for
`spatialLedgers.beliefMaps`, in the same file, four lines from the arm being widened
— or blow a full, shrink-only ceiling. Under `INFRA-PREAMBLE.md` §P8.4 the code wins.

**THE SHIPPED SHAPE, which is strictly stronger than today's blanket claim.** The
partition keeps the zero-candidate cohort's assertion byte-identical, and for a
candidate-bearing lane it asserts BOTH halves:

- the declared `eventTypes` equals the lane's **separable** literals (here: empty,
  because no literal this lane's leaves mint is attributable to this flag); and
- **every literal the leaves mint is enumerated** and carries either a declaration
  or a written shared-literal reason, so an under-claim is as loud as an over-claim.

That preserves the arm's stated purpose verbatim — *"under-claiming rots exactly
like over-claiming, it just reads as modesty"* — while refusing to buy visibility
with a claim the evidence law forbids. A silent `eventTypes: []` on a
candidate-bearing lane is exactly what the old arm could not distinguish from an
honest one; the new arm makes the distinction and writes the reason down.

**JUDGMENT (vetoable): assert declared-equals-SEPARABLE with an enumerated
shared-literal ledger, rather than declared-equals-MINTED.** *Chose the spelling
that keeps the certification claim true over the spelling §4.3(a)'s sentence names,
because the literal one grades a dark subsystem ALIVE off a shared channel, and a
row that grades ALIVE on another lane's traffic is worse than no row at all. Say
"veto" and the arm asserts declared-equals-MINTED, which forces
`eventTypes: ['institution_build','institution_closure']` onto this row and either
a sixth escape-hatch member or an `indirect` claim no receipt can support.*
