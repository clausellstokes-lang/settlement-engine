# Settlement editor / EM-B1b — the seven OFF-STAGE ops under the phantom consequence rule, and the guard-coverage instrument

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠ Ten commits moved the branch under this lane (11:01→11:33 EDT), all docs plus two unrelated
  files; `d31af2cee` **IS an ancestor** of `7aa769830` and **every measured path is blob-identical
  across the window** (evidence §0). Held at `d31af2cee` per the chair's ruling (6).
- **Last revalidated:** 2026-09-19 11:33 EDT, `d31af2cee`
- **Depends on:** **`EM-B1a`** — this packet CREATES its own leaf for the seven off-stage rows and
  spreads them into B1a's `OP_TYPES` (one import, one spread); it uses B1a's `makeOp` /
  `validateOp` and both closed vocabularies unchanged. **B1a lands first.** Also `EM-A1` (typedefs).
  ⓘ **PLACEMENT IS JUST-IN-TIME (the chair's ruling 3):** `scripts/mutation-coverage-manifest.json`
  is held by `EM-A1` at DRAFT, and DRAFT reserves as READY does, so **this packet is not placed in
  `PACKET_MANIFEST.json` until that path is free** — it waits in the chair kit. Nothing in the
  contract changes; only when the row enters the manifest does.
- **Collision group:** **`EM-B1a`** — two shared files, `src/domain/edit/operations.js` (which this
  packet touches by **two effective lines only**) and `tests/domain/editOperations.test.js`.
  ⛔ **They must serialize.** This packet's arms re-assert
  B1a's totality so a dropped row reds. ⛔⛔ **AND `scripts/mutation-coverage-manifest.json` NOW HAS A LIVE NON-TERMINAL HOLDER.**
  Re-measured at `e02bf0f26` (the manifest moved in the window): 187 packets, statuses
  `LANDED, SUPERSEDED, DRAFT, READY`, and **`EM-A1` at DRAFT claims that path**. Since DRAFT
  reserves exactly as READY does, `validate:packets` reds if both hold it. **The chair sequences
  EM-A1 and EM-B1b, or one defers the row to the terminal as the census row is deferred.**
  **RAISED R4.**
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: `scripts/mutation-coverage-manifest.json`
  holds **704** `invariants` rows of kinds `rationale | mutation | uncovered`, ~472 kB; a
  `rationale` row is `{ kind: 'rationale', rationale: '<the executed account>' }`; `tests/lint` is
  the first of the ENFORCER DIRS. Census tuple `2645 / 383 / 2262 / 25009 / 6670`. No test was run.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
  ⓘ Per the chair's ruling (6) this lane does not stamp it.

---

## 1. Reconciled authority

1. **THE CHAIR'S RULINGS, 2026-09-19** (ODQ §934.36 addendum, §934.46): **(1)** EM-B1 **SPLITS** —
   this packet is **B1b**: *the seven OFF-STAGE ops under §13 + the coverage walker + its
   mutation-coverage row*, depending on B1a. **(6)** the base stays `d31af2cee`. **(8)** the
   census counts test files.
2. **ODQ §934.43 / design §13 — THE PHANTOM CONSEQUENCE RULE**, the owner's: *a phantom
   counterparty can absorb an act but never return one.* Carried verbatim into §6: (a) exactly
   seven types are `stage: 'off-stage'`; (b) each carries `consequence: 'by-target-reality'` and
   the resolver `consequenceFor(target) → 'home-procedures+record' | 'world'` is **EM-F1's**, so
   this packet declares the POLICY AS DATA and nothing more; (c) for a phantom target the only
   effects are the home's own existing procedures plus the chronicle line — **no war state,
   treaty, route, faction-power or legitimacy shift**; for a real save the decree is handed to the
   campaign's inter-settlement machinery; (d) **an off-stage op's relations must not assume
   phantom-side state exists** — `make-peace` requires a prior `declare-war` **ENTRY IN THE
   REGISTRY**, never a war state in the world; (e) **no acceptance case beyond eight** — the
   policy folds into the declaration and validation cases.
   ⚠ The muster / casualty / upkeep verified-fact rows are **NOT owed by this packet** (EM-F1,
   wave 5); they appear only as the forbidden alternative home — *no second force-return
   mechanism* (§5).
3. **design §12.8 GOVERNS the coverage instrument** — coverage is **executable rule FUNCTIONS per
   op type, never a string**, and *"the op-coverage walker refuses a declared rule that cannot
   fire."* **ARCH §5**: coverage is declared in `OP_TYPES[type].guards` and **"stated when empty."**
4. **THE PROMISE** — an applied decree reopens read-only; promotion never rewrites a record-only
   past (§13's closing clause, EM-F2's).
5. **`EM-PREAMBLE.md`** §P2 (the mutation-coverage obligation, §P2.2), §P5 (HZ-PHANTOM), §P6 (the
   EM amendment: a `tests/lint/` acceptance file DOES owe its manifest row), §P8 — cited by hash.
6. **ARCH §8 instrument 3** (`opGuardCoverage.walker`), **§9** (the amended op list).
7. Live code at `d31af2cee`.

**Resolved contradictions:**

- "per-type guard coverage as FUNCTIONS" (charter) **vs** nothing to point at in wave 1
  (`guardRules.js` is EM-C3's) → reconciled by **ARCH §5's own clause, "stated when empty"**:
  every type declares `guards: []` plus a non-empty `guardsStated` reason at this wave, and EM-C3
  populates. §12.8's *"refuses a declared rule that cannot fire"* bites only on a **declared** rule,
  of which there are zero here, so the instrument is honest rather than vacuous. No contradiction
  survives, and this is stated rather than assumed because a walker over an empty declaration set
  is exactly the kind of instrument that can be mistaken for a passing guard.

---

## 2. Outcome

**Observable result:** the op catalogue gains the seven off-stage acts, each carrying the owner's
consequence policy as declared data and prerequisites that name registry entries rather than
world state; and `tests/lint/opGuardCoverage.walker.test.js` makes every op type's guard coverage
VISIBLE, so unfinished coverage can never be silent.

**Definition of done:** `OP_TYPES` holds exactly twenty-five types — B1a's eighteen plus these
seven; the seven carry `stage: 'off-stage'` and `consequence: 'by-target-reality'`, with the two
partitions asserted set-equal; no off-stage relation names a world predicate; the walker proves
every type declares coverage; the manifest row is appended surgically; the leaf lands DARK.

In scope: (1) the seven off-stage rows with the §13 policy; (2) no integration — headless; (3) the
prevention guard, `opGuardCoverage.walker.test.js`, with its mutation-coverage row.

Explicit non-goals: ⭐ **THE REAL-SAVE PATH OF THE THREE "MAKE THEM" DIRECTIVES — a pin on the
counterparty's own fork — which is EM-E4's** (ODQ §934.47 add. 10 confirms a packet may ship an op
whose real-save path belongs to a later packet). The **phantom** path is reachable here: a
declared, record-only offer that satisfies the home's predicate at the tick (§13). **No fork pin is
implemented in this packet.** Also: the guard RULES (EM-C3) and the folding engine (EM-C2); **`consequenceFor` and
every phantom mechanic** (EM-F1); the muster / casualty / upkeep path a returning force uses
(EM-F1) — this packet writes none and names none as a write target; the PHANTOM/REAL badge (a
surface, EM-D3); the registry (EM-C1), the layer (EM-B2), the persisted keys (EM-B3), the tick
(EM-E1); any golden, tuning or migration.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | **`1`** (`src/domain/edit/operationsOffStage.js`) | ≤2 |
| Existing logic-bearing production files modified | **`1`** (`src/domain/edit/operations.js` — **one import + one spread, +2 eff**) | ≤3 |
| Additional registration-only files | **`1`** (`scripts/mutation-coverage-manifest.json`) | ≤3 |
| Handwritten files total | `5` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≈83 (estimate)** | ≤400 |
| Effective lines per new leaf | **≈83 of 250** (`operationsOffStage.js`) | ≤250 |
| **`operations.js` after B1a + B1b** | ⭐ **≈233–251 → the +2 spread only** | ≤250 |
| Delta in a shared/hot file | `0` — `operations.js` is a SIBLING's file, not a hot-list file | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE`. **HOT FILES: none named** — `operations.js` is new in
this train, carries no `scripts/.size-baseline.json` entry and no ceiling of its own.

⭐⭐ **THE FILE CAP IS RESOLVED — OPTION O1, AS THE CHAIR SHAPED IT (ruling 2).** This packet
**CREATES its own leaf** `src/domain/edit/operationsOffStage.js` carrying the seven off-stage
rows (≈83 effective of 250) and **MODIFIES `src/domain/edit/operations.js` by exactly two
effective lines** — one import and one spread into the catalogue:

```js
import { OFF_STAGE_OP_TYPES } from './operationsOffStage.js';   // +1
export const OP_TYPES = Object.freeze({ ...HOME_OP_TYPES, ...OFF_STAGE_OP_TYPES });  // +1
```

⛔ **EM-B1a's manifest is UNCHANGED**, exactly as the chair directed: B1a authors
`HOME_OP_TYPES` and the two closed vocabularies, and the spread above is this packet's single
edit. Both files land inside the cap — B1a ≈231–249, this leaf ≈83 — and the earlier
≈314–332 overage is retired. The lane's O2 and O3 are withdrawn with it; **O3 remains recorded as
refused**, since it was the squeeze the chair forbade.

**Three honest options, costed; the chair rules (R1):**

| # | option | effect on `operations.js` | cost |
|---|---|---|---|
| **O1 — two leaves** | B1b writes `src/domain/edit/operationsOffStage.js` (≈83) and B1a's file re-exports its rows into `OP_TYPES` from that module | B1a ≈231–249, B1b ≈83, **both inside 250** | one extra production leaf — B1a would then hold 1 of ≤2 new leaves and B1b 1 of ≤2, each inside its own budget. ⚠ It makes `OP_TYPES` a composition of two frozen maps, which A1's totality arm must then assert over the composition |
| **O2 — take EM-B1c too** | the three `rename-*` ops + `set-world-fact` (≈36) leave B1a as B1a pre-declared, and the off-stage seven still land in the same file | ≈278–296 — **still over** | insufficient on its own; O2 only helps combined with O1 |
| **O3 — a data-only row form** | every row's ten fields expressed as one compact frozen literal per type (a declared shape rather than ten authored lines) | unmeasurable at compile without writing it | ⛔ **this is the squeeze the chair forbade**; recorded to be refused, not chosen |

⭐ **The lane's reading is O1**, because it is the only one that puts both halves inside the cap
without compressing a row, and because it follows the same boundary the chair already drew — home
acts in one module, off-stage acts in another. **But it changes B1a's manifest**, so it is the
chair's call, not this lane's. Until it is ruled, this packet's manifest names B1a's file as its
MODIFY target (the shape the chair ordered), and §11 makes crossing 250 a STOP.

Decomposition of the ≈83: seven rows × ~9 effective ≈ 63; the policy's shared constants and the
`by-target-reality` wiring ≈ 12; imports ≈ 8.

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1b
```

Expected: capsule emitted; ancestry and substrate proven; **`CREATE` target ABSENT**
(`tests/lint/opGuardCoverage.walker.test.js` — measured absent); **non-CREATE targets
`src/domain/edit/operations.js` and `tests/domain/editOperations.test.js` PRESENT AND CLEAN** —
which is only true once **EM-B1a has landed**, so ancestry is also the dependency check; and
`scripts/mutation-coverage-manifest.json` present and **clean**.

⚠ **B1a and B1b share two files and must serialize.** Dispatching this one while B1a is
non-terminal reds `validate:packets` on the duplicate path.

⚠ `scripts/mutation-coverage-manifest.json` is 704 rows and ~472 kB. Preflight must confirm no
sibling lane holds it dirty: a concurrent whole-file re-serialisation would bury this packet's
single row, which is exactly what `PACKET_STANDARD.md` forbids.

---

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **B1a's machinery** | `src/domain/edit/operations.js` | `OP_TYPES`, `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `makeOp`, `validateOp` | ⚠ **Does not exist at this base** — EM-B1a creates it. Both closed vocabularies already carry BOTH members, so this packet appends rows without editing a frozen constant | Extend; never fork a second `OP_TYPES`, a second validator, or a second stage vocabulary |
| **Register row shape** | `scripts/mutation-coverage-manifest.json` | `invariants` | Executed: **704** rows; kinds `rationale \| mutation \| uncovered`; a `rationale` row is `{ kind: 'rationale', rationale: '<the executed account>' }`; the file is ~472 kB | The exact shape of the ONE row this packet appends, surgically |
| **The obligation's source** | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` | `tests/lint` is the FIRST entry (`:36-37`); `tests/lint/mutationCoverageManifest.test.js` asserts every enumerated file owns an `invariants` entry | Why the row is owed AT COMPILE by this packet and not by B1a |
| **Walker precedent** | `tests/lint/chooserTotality.walker.test.js` | `const SCAN_ROOTS`; HB-1's A7/A8 ("classified equals discovered both directions", "symbolsWithTwoDispositions empty") | A register walker asserts its table SET-EQUAL to the live scan in BOTH directions and reports a full offender list | **Copy this shape** for the coverage walker |
| **Test precedent — domain** | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q …')` + seven straight-line `it` | One literal `describe`, no `.each`/`runIf`/nesting, positive control first | Copy for the appended arms (§P3.4) |
| **Stable order** | `src/domain/deterministicSort.js` | `compareCodepoint` | The estate's one sanctioned, locale-free string order | The appended rows' key order |

**Forbidden alternatives:**

- ⛔ **no second force-return mechanism** — a returning force resolves through the home's EXISTING
  muster / casualty / upkeep mechanics (EM-F1, wave 5). This packet writes none, names none as a
  write target, and must not grow one (design §13);
- ⛔ **no phantom-side state, ever** — no war state, treaty, trade route, envoy state,
  faction-power or legitimacy shift derived from a phantom (§P8);
- ⛔ **`consequenceFor` is authored, imported and referenced NOWHERE here** — it is EM-F1's;
- ⛔ **no whole-file re-serialisation** of `scripts/mutation-coverage-manifest.json`;
- no second `OP_TYPES`, validator, constructor or stage vocabulary; no adapter per op type
  (§12.13); no import of `src/kernel/prng.js`, `src/kernel/rngContext.js`, `src/store/**` or
  `src/components/**`;
- no edit to any existing file **other than B1a's two and the manifest**;
- no files outside the manifest.

---

## 6. Exact contracts

### The seven OFF-STAGE op types — exactly the ARCH §9 OFF-STAGE list

`declare-war` · `make-peace` · `open-trade` · `close-trade` · `send-force` · `recall-force` ·
`resolve-outcome`

Every one carries `stage: 'off-stage'` and `consequence: 'by-target-reality'`, and every row
carries all ten fields of B1a's `OpTypeDeclaration` — none optional, none omitted.

### THE PHANTOM CONSEQUENCE POLICY — design §13, spelled with no discretion

| clause | contract |
|---|---|
| **`stage`, exactly** | `off-stage` for **exactly these seven**; every other type is `home` (B1a's). The partition is TOTAL over all twenty-five and asserted both directions (A3). |
| **`consequence`, exactly** | `'by-target-reality'` on exactly these seven. The two sets are the same partition, asserted **SET-EQUAL** to the `stage` partition so they can never drift apart. |
| **The resolver is NOT here** | Consequence is decided **at apply time** by `consequenceFor(target) → 'home-procedures+record' \| 'world'`, which **EM-F1 owns**. This packet declares the POLICY as data and nothing more. ⛔ A `consequenceFor` implementation appearing here is a STOP. |
| **What a phantom act may produce** | Only (a) the home's own EXISTING procedures on the home's own state — a force resolves won or lost and returns through the existing muster/casualty/upkeep mechanics; an envoy or caravan returns unchanged — and (b) the chronicle line. **No war state, treaty, trade route, envoy state, faction-power or legitimacy shift.** This packet encodes that by DECLARING it and by writing no such effect; EM-E1 applies it. |
| **A real save** | The decree is handed to the campaign's inter-settlement machinery. That path is the simulator's; the editor only hands it over. |
| ⛔ **Relations must not assume phantom-side state** | `make-peace.requires` is **`['declare-war']` — a prior ENTRY IN THE REGISTRY**, never a war state in the world. The same law binds `recall-force` (the `send-force` ENTRY) and `close-trade` (the `open-trade` ENTRY). **A relation naming a world predicate on an off-stage type is an A4 red.** |
| **Consequence the DM wants is a separate decree** | A defeat that should shake the town is a typed op **on the town itself**, staged and guarded like any other; the registry may OFFER it as a follows-from suggestion (a connection guard with `fulfil`) and **never applies it on its own** (§13). Encoded here as `relatedTo`, never as `enables` of an automatic effect. |
| **Promotion** | Out of scope; §13's closing clause (record-only outcomes stay record-only) is EM-F2's. |

### Guard coverage at this wave — declared, empty, and honest

Every one of the seven declares `guards: []` **and** a non-empty `guardsStated` naming EM-C3 as
the owner of its rules. ARCH §5's *"stated when empty"* is the authority; §12.8's *"refuses a
declared rule that cannot fire"* bites only on a declared rule, of which there are none.
⛔ **A rule FUNCTION authored in this packet is a STOP** — the rules are EM-C3's, and a function
here would be a guard rule living in the op catalogue.

### Inputs, outputs, state schema

Unchanged from B1a — this packet adds no export and changes no signature. `OP_TYPES` gains seven
rows; `makeOp` and `validateOp` are untouched. **No state is persisted, written or minted.**

Absence rules — **identical to B1a and deliberately not re-specified in a second place**.

### Transition table

Unchanged from B1a. ⚠ One clause is worth stating because it is the product law: a **well-formed**
off-stage op against a phantom target validates **`ok: true`**. `validateOp` reports malformation
only and **never refuses an act**, because at this table a god sits and magic is real (design
§2.7; §P8). A8 asserts it.

### Ordering, determinism, flag, lifecycle

Pipeline position **NONE**; stable enumeration `compareCodepoint` over the combined twenty-five;
**hash/fork key `NONE`** — this packet draws no random number and imports no PRNG; flag `NONE`;
**golden posture `UNCHANGED`** (structurally — nothing imports the leaf and it takes no draw;
motion is a STOP); nothing persisted, so no migration and no veil is owed here.

### Receipts and privacy

`NONE` — no receipt, no figure, no DM-only field, no projection.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: a vocabulary of acts; it reads no alignment, law or temper axis.`
- **Edit story:** `ENGINE-ONLY: the DM's verbs arrive from EM-D2's dialog through EM-C4's single
  adapter.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/operationsOffStage.js` | `OFF_STAGE_OP_TYPES` | **250 eff (cap); ≈83 estimated** | The seven rows of §6 as one frozen map, each with `stage:'off-stage'`, `consequence:'by-target-reality'`, `guards: []` + a non-empty `guardsStated`, and prerequisites naming REGISTRY ENTRIES only. Import the two closed vocabularies from `operations.js`; add no second validator, constructor or stage vocabulary. ⛔ Author `consequenceFor` nowhere; author no rule function; write no force-return path. |
| `MODIFY` | `src/domain/edit/operations.js` | the `OP_TYPES` composition | **+2 eff** | EXACTLY one import of `OFF_STAGE_OP_TYPES` and one spread into the frozen `OP_TYPES`. ⛔ Change no B1a row, no signature, no vocabulary, nothing else in the file. |
| `MODIFY` | `tests/domain/editOperations.test.js` | arms B1–B4 appended | `n/a` | Append to B1a's single literal `describe`; straight-line `it`, no `.each`/nesting (§P3.4). Re-assert B1a's eighteen so a dropped row reds. Negatives carry `// anchored:` on the line immediately above. |
| `CREATE` | `tests/lint/opGuardCoverage.walker.test.js` | arms B5–B8 | `n/a` | The coverage walker in the `chooserTotality` shape: every `OP_TYPES` row declares `guards` (an array) AND a non-empty `guardsStated`; the declared set SET-EQUALS the live scan both directions with a full offender list; a declared entry that is not a function reds; the walk is asserted non-empty first. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | ONE new `invariants` row keyed `tests/lint/opGuardCoverage.walker.test.js` | `+1 row` | ⛔ **SURGICALLY beside its siblings**, never by re-serialising the file. Kind `rationale`, carrying the EXECUTED mutant account of §8 step 6. **704 → 705.** |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the tuple | `n/a` | ⛔ **DEFERRED TO THE TERMINAL** — no edit. |

Generated artifacts: `NONE`. ⛔ **Edge-shared closure NOT owed** — the only modified production
file is a leaf this train creates, which is in no bundle closure.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — `+1 file`, INTERIOR RED** | This packet adds ONE new test file (`tests/lint/opGuardCoverage.walker.test.js`) and APPENDS arms to B1a's existing one. `files` is `TEST_FILES.length` (`:612`), so: `+1 files / +0 parked / +1 credited / +8 titles / +1 suiteTitles` — four titles from the appended arms plus four from the new walker. |
| P2.2 | mutation-coverage row | ⛔ **OWED — and it is THIS packet's, priced here** | `tests/lint` is the first ENFORCER DIR (`mutationCoverage.shared.mjs:36-37`) and `mutationCoverageManifest.test.js` asserts every enumerated file owns an `invariants` entry. ⭐ The split moved the obligation cleanly **with the file that incurs it** — B1a owes nothing. This is the obligation `PACKET_STANDARD.md` records as discovered at a terminal twice. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key read; nothing persisted. |
| P2.4 | writer-reach | **CANNOT MOVE** | `SURFACE_CLOSURE_STOP` includes `'src/store/'` (`writer-reach-scan.mjs:115-117`). |
| P2.5 | decision-fork + mechanism-coverage | **NOT OWED** | No seeded chooser, no pool; this packet draws nothing at all. |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |

> ⛔ **THE CENSUS ROW IS DEFERRED (§417 shape)** — DRAFT reserves as READY does, so no edit is made
> and `EM-B1b.manifest.json` **omits** the path. Predicted interior red:
> `the estate's file count moved — re-measure, do not re-word: expected 2647 to be 2646`
> (B1a having already moved it to 2646).

---

## 8. Ordered coding sequence

0. Dispatch and seal — **only after EM-B1a has landed**; re-read `git rev-parse HEAD` in the same
   command; confirm the mutation-coverage manifest is clean.
1. Capture the baseline: the census figures; `sha256` of
   `tests/fixtures/generator-golden-master.json`; the `invariants` row count (**704**).
2. Append B1–B4 to `tests/domain/editOperations.test.js` and add
   `tests/lint/opGuardCoverage.walker.test.js` with B5–B8, all **failing**.
3. Implement the seven rows, off-stage policy first, then the relations.
4. Sole writer / lifecycle seam: **NOT APPLICABLE** — record as skipped.
5. Wire consumers: **NOT APPLICABLE** — lands DARK. Record as skipped.
6. Plant the mutants (§P6), convict them, restore digest-exact — **then** write the
   `scripts/mutation-coverage-manifest.json` row, because its `rationale` must carry the EXECUTED
   account and never a predicted one.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan; write the completion receipt.

---

## 9. Acceptance matrix

Four arms appended to B1a's `describe`; four in the new walker.

| ID | Case | Required observation | Home |
|---|---|---|---|
| **B1** | **Main + B1a's totality re-asserted** | `OP_TYPES` now holds exactly **twenty-five** types — B1a's eighteen **plus** these seven — set-equal both directions with a full offender list, so a row dropped by either packet reds here. Every new row carries all ten fields with `guardsStated` non-empty; `Object.keys(OP_TYPES)` remains `compareCodepoint`-ordered over the combined set. | `tests/domain/editOperations.test.js` |
| **B2** | **⛔ THE §13 PARTITION, TOTAL AND SET-EQUAL** | The `stage:'off-stage'` set is **exactly** `{declare-war, make-peace, open-trade, close-trade, send-force, recall-force, resolve-outcome}` — an exact sorted list, never a length — and every other type is `home`. The `consequence:'by-target-reality'` set **SET-EQUALS** the off-stage set, and `consequence:'home'` equals the home set. Counterforce: a source scan proves `consequenceFor` is defined **nowhere** in the module — the resolver is EM-F1's. | same |
| **B3** | **⛔ NO PHANTOM-SIDE PREREQUISITE (design §13's clause d)** | For **every** off-stage type, `requires` contains only op-type keys and **no world predicate** — asserted by name, with `make-peace.requires` pinned to exactly `['declare-war']` (the prior REGISTRY ENTRY), and the same for `recall-force` (`send-force`) and `close-trade` (`open-trade`). Relational integrity is re-run over all twenty-five: every relation string is an `OP_TYPES` key; `conflictsWith` and `relatedTo` symmetric; `requires`/`enables` exact inverses. | same |
| **B4** | **The report-never-refuse law, and no force-return path** | A **well-formed** off-stage op against a phantom target validates **`ok: true`** — `validateOp` reports malformation only and never refuses an act (design §2.7; §P8). ⭐ Plus the forbidden-home arm: a source scan proves the module imports **no force, muster, casualty or upkeep module** and writes no such path, with the matcher proved live on a planted string — the home procedures stay EM-F1's. | same |
| **B5** | **THE COVERAGE WALKER — guard-the-guard, first** | The walk is asserted non-empty before any membership claim; every one of the twenty-five types declares `guards` as an **array** and `guardsStated` as a **non-empty string**. | `tests/lint/opGuardCoverage.walker.test.js` |
| **B6** | **Declared equals discovered, both directions** | The declared coverage set SET-EQUALS the live scan in BOTH directions with a full offender list (the `chooserTotality` shape) — an unregistered type reds, a stale row reds. | same |
| **B7** | **A declared rule must be able to fire (§12.8)** | A declared `guards` entry that is **not a function** reds; a row whose `guards` is non-empty while `guardsStated` claims emptiness reds. ⭐ At this wave every row is legitimately `guards: []`, and **that is asserted as the current state with its reason**, so the instrument is honest rather than vacuous and EM-C3's population will move it visibly. | same |
| **B8** | **The register's own guard** | `tests/lint/opGuardCoverage.walker.test.js` owns an `invariants` entry in `scripts/mutation-coverage-manifest.json` (the obligation this packet prices), asserted from the test side so a dropped row reds here rather than at a terminal. | same |

**8 of ≤8** — and the §13 policy folds into B2/B3/B4 rather than adding a case, exactly as the
chair's amendment clause (5) directs.

---

## 10. Verification commands

```sh
npx eslint src/domain/edit/operations.js tests/domain/editOperations.test.js \
  tests/lint/opGuardCoverage.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editOperations.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/opGuardCoverage.walker.test.js tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B1b
npm run implementation:resume -- EM-B1b
```

Expected: every command exits `0`, **except** the named census interior red until the terminal.
⛔ Never read a gate through a shell pipe (§P7). A member never runs `npm run check`.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: ⛔ **a fork pin appears necessary** — **no
fork pin is implemented here**; the three "make them" directives declare `consequence:
'by-target-reality'` and their real-save half is EM-E4's, so writing one is a different packet;
**EM-B1a has not landed** — this packet
modifies its files; the seal is missing or foreign; HEAD is not `d31af2cee` or a descendant proved
non-interfering; **either `operations.js` or `operationsOffStage.js` measures > 250 effective lines** under
eslint's own `Linter` with `skipBlankLines` and `skipComments`, or the `operations.js` edit exceeds
**+2 effective**, → STOP, and **never squeeze a row to fit**; `scripts/mutation-coverage-manifest.json` would
need re-serialising whole, or is dirty from another lane; **any phantom-side world state appears
necessary** (a war state, a treaty, a route, an envoy state, a faction-power or legitimacy shift);
**a second force-return mechanism appears necessary**; `consequenceFor` would need authoring,
importing or referencing; **a guard RULE FUNCTION would need authoring** (EM-C3's); an off-stage
type's `requires` would need a world predicate rather than a registry ENTRY; an adapter per op type
appears necessary; a PRNG or `rngContext` import appears necessary; a golden or the prose manifest
moves by one byte; any B1a row would have to change.

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas, **with
the COMBINED `operations.js` figure measured by eslint's `Linter`** · acceptance B1–B8 plus B1a's
A1–A8 re-run green · the mutants planted, convicted and restored digest-exact (§P6), **with the
account copied verbatim into the manifest row** · `invariants` row count before and after
(704 → 705) and proof the file was NOT re-serialised (a `git diff --stat` showing one changed hunk)
· focused commands, exits and counts · sealed per-step receipt and resume status · both typecheck
configurations · gate stages actually executed · base-versus-wave failure identity diff ·
dormancy/golden result · census tuple before and at the tip with the interior red quoted verbatim ·
generated artifacts `NONE` · deviations `NONE | STOP` · out-of-scope observations without
investigation · **judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | ✅ **CLOSED by the chair's ruling (2).** O1 is taken and shaped so B1a's manifest is unchanged: this packet CREATES `operationsOffStage.js` and touches `operations.js` by one import and one spread (+2 effective). Both files sit inside the 250 cap. O3 stays recorded as refused. |
| **R2** | **`OP_TYPES` is now a composition of two frozen maps**, so B1a's A1 totality arm and this packet's B1/B6 assert over the composition rather than one literal. ⚠ One consequence worth ruling: `Object.freeze({...A, ...B})` freezes the OUTER map only, so B1/B6 assert each SOURCE map frozen as well — otherwise a row could be mutated through `OFF_STAGE_OP_TYPES` while `OP_TYPES` reports frozen. Confirm that reading. |
| **R3** | **Guard coverage is legitimately empty at this wave** (ARCH §5's "stated when empty"), so the walker asserts a set of `[]`s. B7 pins that as the current state **with its reason**, and EM-C3's population will move it visibly. Confirm that reading, or direct a stricter instrument now rather than after EM-C3 lands. |

---

## 14. ⛔ THE "MAKE THEM" DIRECTIVES JOIN THE OFF-STAGE SET (ODQ §934.50, design §18)

Design §18: *"When a seal is missing, the card says why in the herald's voice and names the act
that would create the condition."* Those acts are **off-stage directives** — they create a
world-state condition on the **counterparty's** side — so they belong here, with the seven.

| new off-stage op | what it creates | real save | phantom |
|---|---|---|---|
| `make-them-sue-for-peace` | a pending peace offer | **a pin on the counterparty's own peace fork — EM-E4's** | a declared, **record-only** offer (§13) that satisfies the home's predicate at the tick |
| `make-them-send-envoy` | an envoy arrived | the same pin form, EM-E4's | record-only, per §13 |
| `open-route` | an open route | the same pin form, EM-E4's | record-only, per §13 |

⛔ All three carry `stage: 'off-stage'` and `consequence: 'by-target-reality'` like the other
seven — **and they are the clearest case for that policy in the whole catalogue**: against a real
save the decree is handed to the campaign's machinery (a fork pin); against a phantom it is the
record and the home procedures and **nothing else**, because a phantom can absorb an act but never
return one (§13).

**Two more rows the ruling names, with their `requires.world` measured:**

| op | `requires.world` | measured |
|---|---|---|
| `sue-for-peace` | **`warInProgress(counterparty)` ONLY** — the ruling is explicit | `atWarWith(graph, worldState, a, b)` — `embassyHazard.js:74`. ✅ LIVE |
| `schedule-event` | ⭐ **NOTHING** — *"always (from the catalogue)"*; `when` at or after the next tick | a `home` op, not off-stage; it belongs to **EM-B1a**'s set |

⇒ **the off-stage set goes from seven to eleven** (`declare-war`, `make-peace`, `open-trade`,
`close-trade`, `send-force`, `recall-force`, `resolve-outcome`, plus `sue-for-peace`,
`make-them-sue-for-peace`, `make-them-send-envoy`, `open-route`), and `schedule-event` is a
nineteenth **home** op for EM-B1a. ⚠ **RAISED R5** — `schedule-event` changes B1a's membership,
and B1a is already over its cap by §16.3.

**Budget:** eleven rows × ~9 effective ≈ **99**, plus the policy's shared constants ≈ 12 and
imports ≈ 8 ⇒ **≈119 of the 250 leaf cap** in `operationsOffStage.js` — still comfortably inside,
so O1's shape holds and **no further split is needed here**.

**Acceptance stays at 8.** The four new rows fold into **B2** (the partition, now eleven asserted
as an exact sorted list) and **B3** (no phantom-side prerequisite — the three "make them" rows are
the sharpest test of it, since they *create* the counterparty's condition and must still name only
registry entries in `requires.registry`). **No case is added.**

| **R5** | **`schedule-event` is a HOME op, not an off-stage one** (design §18: *"always (from the catalogue)"*, `requires` empty), so it belongs to **EM-B1a**'s set as a nineteenth row and is NOT compiled here. B1a is already over its cap by its own §16.3, so the two questions land together — raised in both packets so neither can be ruled in isolation. |
| **R6** | **The three "make them" directives depend on EM-E4 for their REAL-save half** (a pin on the counterparty's own fork). Their PHANTOM half is complete here under §13 (record-only). Confirm that a packet may ship an op whose real-save path is another packet's — the alternative is holding all three until EM-E4, which would leave the phantom path unreachable too. |
