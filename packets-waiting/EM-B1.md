# Settlement editor / EM-B1 — the typed op catalogue: one mutation vocabulary, its constructor and validator, the declared relations, and the phantom consequence policy

- **Status:** SUPERSEDED
  ⛔ **SUPERSEDED BY EM-B1a (machinery + the eighteen HOME ops) and EM-B1b (the seven OFF-STAGE ops under design §13 + the coverage walker + its mutation-coverage row).**
  Reason: the chair's ruling (1) ordered the split this packet proposed; ruling (2) set the home membership at eighteen and struck `set-state`.
  Retained UNEDITED below as the compile record — its measurements, refutations and
  evidence are cited verbatim by the successors and remain valid at the same base.
  ⚠ DO NOT PROMOTE THIS FILE.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠⚠ **THE BASE MOVED TWICE UNDER THIS LANE AND BOTH MOVES ARE PROVED NON-INTERFERING.**
  `d31af2cee` (11:01:32 EDT) → `02968876b` (11:06:09) → `a03ebb09a17e0a96c1d6261a41257430bb7fbd32`
  (11:17:13). Five commits, six files: four docs (the preamble, the design, the ARCH, the charter),
  `.gitignore`, and one EDIT to `tests/build/generationWorkerLazy.test.js`. `d31af2cee` **IS an
  ancestor**, and **all twenty-three measured paths are blob-identical across the full window** —
  `src/domain/factionRename.js`, `src/generators/power/rulingStructure.js`,
  `src/generators/structuralValidator.js` and the census baseline among them (executed,
  `EM-B1.evidence.md` §0). `PACKET_STANDARD.md`'s **J-T1** clause. **RAISED R0.**
- **Last revalidated:** 2026-09-19 11:17 EDT, `d31af2cee` (descendant `a03ebb09a` proved
  non-interfering)
- **Depends on:** `EM-A1` (`src/domain/edit/types.js` — the `Op` and `EntityRef` typedefs this
  packet's JSDoc references). **Not landed; a packet ID, not a SHA.** ⚠ EM-A1 must land FIRST or
  this packet's typedef imports have no home; that is the only ordering constraint.
- **Collision group:** `NONE` against the registered manifest. **Measured by execution: all 182
  packets in `PACKET_MANIFEST.json` are TERMINAL** (`LANDED` or `SUPERSEDED` — the only two
  statuses present), so no path is reserved non-terminally; this packet's three CREATE paths have
  zero holders of any status (evidence §6).
  ⚠ **THE LIVE COLLISION IS WITH THE EM SIBLINGS BEING COMPILED RIGHT NOW.** Two shared paths:
  `tests/lint/sovereigntyLightingContract.walker.test.js` (89 terminal holders today — the
  terminal's under the train, preamble §P3.2, deferred at §7) and
  `scripts/mutation-coverage-manifest.json` (26 terminal holders — a surgical single-row REGISTER
  this packet DOES claim, never re-serialised whole). **DRAFT reserves exactly as READY does**, so
  if a sibling EM member also adds a `tests/lint/` file, the chair sequences the two.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: `FACTION_ARCHETYPES` 13 values;
  `GATE_FEATURES` is the live `requires` prerequisite table; `renormalizeFactionPower` MUTATES in
  place and returns the same array reference; `checkInstCompat` returns a PROSE SENTENCE;
  `checkStructuralValidity` returns `{ violations, suggestions }`; `factionRename.js` exports
  twelve symbols; `scripts/mutation-coverage-manifest.json` holds 704 `invariants` rows of kinds
  `rationale | mutation | uncovered`; the census tuple `2645 / 383 / 2262 / 25009 / 6670`.
  No test was run by this lane.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
  ⓘ Measured at `a03ebb09a` as
  `398e562b125edbf61cd9fcfa855c219411fa738af1a8047bb307cc1e60558abb` — the post-§934.43 value
  (it was `481dab28…` at `02968876b`). The chair stamps the current one.

---

## 1. Reconciled authority

1. **ODQ §934.43 — THE PHANTOM CONSEQUENCE RULE, and the CHAIR AMENDMENT TO THIS PACKET
   (2026-09-19).** The owner's rule: *a phantom counterparty can absorb an act but never return
   one.* Landed on the build branch as **design §13** (`023085560`) and folded into the ARCH's
   `Op` typedef, the phantoms row and the tick row, and into preamble §P5 HZ-PHANTOM and §P8
   (`a03ebb09a`). The chair's amendment to EM-B1, carried verbatim into §6 below with no
   discretion: (1) `Op` gains `stage?: 'home' | 'off-stage'`, with **declare-war, make-peace,
   open-trade, close-trade, send-force, recall-force and resolve-outcome** declared `off-stage`
   and **every other type** `home`; (2) an off-stage op's CONSEQUENCE is **not a field on the op**
   — it is decided at apply time by the target's reality through `consequenceFor(target)`, which
   **EM-F1 owns**, and B1 declares only the policy as data (`consequence: 'by-target-reality'`),
   its guard coverage unchanged; (3) for a phantom target the only effects are the home's own
   existing procedures plus the chronicle line — **no war state, treaty, route, faction-power or
   legitimacy shift**; for a real save the decree is handed to the campaign's inter-settlement
   machinery; (4) an off-stage op's `requires/enables/relatedTo/conflictsWith` **must not assume
   phantom-side state exists** — `make-peace` requires a prior `declare-war` **ENTRY IN THE
   REGISTRY**, never a war state in the world; (5) **no acceptance case is added beyond eight** —
   the policy folds into the existing declaration and validation cases.
   ⚠ The chair's amendment also rules that the muster / casualty / upkeep verified-fact rows are
   **NOT owed by this packet** (they are EM-F1's, wave 5); B1 names them only as the forbidden
   alternative home — *no second force-return mechanism* (§5).
2. **ODQ §934.42** — the editor is built now, from the charter, on the consist tip.
3. **THE PROMISE** (constitutional) — lived history is immutable; an applied decree reopens
   read-only; promotion never rewrites a record-only past (design §13's closing clause).
4. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §12 GOVERNS, and §13 states the consequence rule.**
   §12.3: names are JOIN KEYS — a name change is a typed `rename-*` op that runs the existing
   cascade. §12.8: the initial guard rules, and **the "range over section counts" rule is
   DROPPED**; coverage is executable rule FUNCTIONS per op type, never a string. §12.13: ONE
   generic decree adapter, never twenty.
5. **`docs/implementation/preambles/EM-PREAMBLE.md`** §P2, §P3, §P4, §P5 (HZ-JOINKEY, HZ-PHANTOM),
   §P8 — cited by hash, not restated.
6. **`docs/ARCH_EDIT_MODE_AND_DECREES.md`** §1 (`operations.js` exports `OP_TYPES`, `makeOp`,
   `validateOp`), §2 (the amended `Op` typedef carrying `stage`), §5 (`OP_TYPES[type].guards`,
   "stated when empty"), §9 (the twenty op types), §8 instrument 3 (`opGuardCoverage.walker`).
7. **`docs/implementation/charters/EDIT-MODE-TRAIN.md`**, row **EM-B1**.
8. Live code at `d31af2cee` — which refutes one charter premise outright.

**Resolved contradictions:**

- ARCH §9's closed list of **twenty** op types contains **no rename op**, while design §12.3
  (which GOVERNS) mandates `rename-faction`, `rename-npc` and `rename-settlement`, and the
  charter's own EM-B1 row says "`rename-*` ops call the existing cascade". The list must therefore
  grow to **twenty-three** or displace three members. §12 governs, so the packet specifies
  twenty-three and does not displace. **This moves the budget by ~15% and is RAISED as R1.**
- "per-type guard coverage as FUNCTIONS" (charter) **vs** nothing to point at in wave 1
  (`guardRules.js` is EM-C3's) → reconciled by ARCH §5's own clause, *"stated when empty"*: every
  type declares `guards: []` plus a non-empty `guardsStated` reason at this wave, and EM-C3
  populates. §12.8's "refuses a declared rule that cannot fire" bites only on a declared rule, of
  which there are zero here. No contradiction survives.
- The charter's required symbol **`checkInstCompat`** is the wrong symbol for the job the design
  names — **REFUTED, see §2 finding F-B1.**

The implementer does not read other documents to reinterpret this packet.

---

## 2. Outcome

**Observable result:** `src/domain/edit/operations.js` is the estate's single typed vocabulary of
what a DM may do to a settlement: every op type declares its target kind, its payload schema, its
stage, its consequence policy and its four typed relations; `makeOp` builds one; `validateOp`
judges one against a world; and nothing anywhere constructs an op another way.

**Definition of done:** `OP_TYPES` holds exactly the declared set (23 pending R1, else 20); every
row carries all nine declared fields with no field absent and no undeclared field present;
`makeOp` and `validateOp` have the exact signatures of §6; the off-stage seven carry
`stage: 'off-stage'` and `consequence: 'by-target-reality'` and **no phantom-side prerequisite**;
`opGuardCoverage.walker` proves every type declares coverage; the leaf lands DARK.

In scope:

1. **One primary behaviour:** the op catalogue with `makeOp` / `validateOp`.
2. **One required integration:** NONE — wave 1 is headless; the first consumer is EM-C4's single
   generic decree adapter (wave 2).
3. **One prevention guard:** `tests/lint/opGuardCoverage.walker.test.js` — every op type declares
   its guard coverage (a rule list or a stated emptiness), so unfinished coverage is VISIBLE
   rather than silent (design §6 instrument 3, ARCH §8.3).

Explicit non-goals:

- **the guard RULES themselves** (EM-C3) and the folding engine (EM-C2);
- **`consequenceFor(target)`** — declared as the policy's resolver here, **authored in EM-F1**;
- the muster / casualty / upkeep mechanics a returning force uses (EM-F1, wave 5) — this packet
  writes no force-return path and names none as a target;
- the registry (EM-C1), the layer (EM-B2), the persisted keys (EM-B3), the tick hook (EM-E1);
- the PHANTOM/REAL badge (a surface, EM-D3);
- any golden, tuning, migration, deployment or paid-surface behaviour.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

### What live code refutes — F-B1, measured, and it does not block this packet

⛔ **`checkInstCompat` IS A PROSE PICKER, NOT A COMPATIBILITY VALIDATOR.** The charter's EM-B1 row
names it as a required symbol, and design §12.8 / ARCH §5 name it as the `prerequisite` guard
rule's source ("a cathedral wants a city; a parish church wants a priest"). Measured at
`src/generators/structuralValidator.js:269`, it is
`(institutions, tier, _magicPriority) => string` and its entire body is a keyword ladder over
institution names returning a **narrative sentence** through `pickRandom` — e.g.
`"The great cathedral's spire is the tallest thing for miles."`. It returns **no boolean, no
violation list and no verdict**, and it **consumes a draw** (`pickRandom` from `./helpers.js`).

**The symbols that actually do that job are two doors down**, and both are measured present:
`checkStructuralValidity` (`:348`) → `{ violations, suggestions }`, which reads `GATE_FEATURES`
(`src/data/spatialData.js:34`) — a live `requires` prerequisite table whose first rows are exactly
the design's example shape (`Citadel` requires `City walls and gates`; `Gates (if walled)` requires
a wall, `suggestionOnly: true`).

**Why this does not block EM-B1:** the guard RULES are EM-C3's, not this packet's, so no code here
calls any of the three. `checkInstCompat` is named in `requiredSymbols` because the charter names
it and it genuinely exists; `checkStructuralValidity` and `GATE_FEATURES` are named beside it so
the correction is carried in the manifest where **EM-C3's compiler will find it**, rather than
being re-discovered as new. ⚠ **If EM-C3 is compiled against the charter's wording unamended, it
will build a prerequisite rule on a sentence generator.** **RAISED R2.**

---

## 3. Hard scope budget — and the STOP AND SPLIT

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` (contested — see below) | 1 |
| New persisted record families | `0` | ≤1 |
| Named state writers | `0` | ≤1 |
| Feature flags | `0` | ≤1 |
| User-facing surfaces | `0` | ≤1 |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | `1` (`operations.js`) | ≤2 |
| Existing logic-bearing production files modified | `0` | ≤3 |
| Additional registration-only files | `1` (`scripts/mutation-coverage-manifest.json`) | ≤3 |
| Handwritten files total | `4` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≈267 at 23 types / ≈234 at 20 (estimate)** | ≤400 |
| **Effective lines per new leaf** | ⛔ **≈267 of 250 — OVER (estimate)** | ≤250 |
| Delta in a shared/hot file | `0` — names no hot file | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE`. **No budget is raised here.**

**HOT FILES: this packet names NONE.**

⛔⛔ **STOP AND SPLIT — INVOKED, on two independent grounds.**

**Ground 1 — the per-leaf line cap.** Each op row must declare nine fields (`target`, `payload`,
`stage`, `consequence`, `requires`, `enables`, `relatedTo`, `conflictsWith`, `guards` +
`guardsStated`), which is ~8–9 effective lines even written tightly. At 23 types that is 184–207,
plus `makeOp` ≈ 15, `validateOp` ≈ 40, the closed vocabularies ≈ 12, helpers ≈ 15, imports ≈ 5 —
**≈267 effective against a 250 cap**, and ≈234 even at the ARCH's bare twenty. The estimate is
over on the R1 reading the design compels, and within 16 lines of the cap on the other. Neither is
a margin a compiler may certify.

**Ground 2 — and this is the stronger one — the chair's own amendment draws the family line.**
§934.43 defines the seven off-stage types as a distinct class with a consequence policy, a
prohibition on phantom-side prerequisites, and a resolver owned by another packet. That is a
second behaviour family inside one row, and the amendment is what makes it legible.

### The proposed split — the smallest, along the amendment's own line

| id | contents | est. effective | fits |
|---|---|---:|---|
| **EM-B1a — the op vocabulary and the HOME ops** | `OP_TYPES` machinery (the closed `OP_STAGES`, `OP_TARGET_KINDS`, `OP_CONSEQUENCE_POLICIES`), `makeOp`, `validateOp`, and the **sixteen `stage: 'home'` types** — `set-field`, `add-institution`, `remove-institution`, `add-npc`, `remove-npc`, `add-faction`, `remove-faction`, `set-power-holder`, `rebalance-power`, `set-relationship`, `found-phantom`, `promote-phantom`, `set-state`, plus the three design-§12.3 `rename-*` ops that run the existing cascade. `tests/domain/editOperations.test.js`. | ≈**215** of 250 | ✅ |
| **EM-B1b — the OFF-STAGE ops under the phantom consequence rule** | the **seven `stage: 'off-stage'` types** — `declare-war`, `make-peace`, `open-trade`, `close-trade`, `send-force`, `recall-force`, `resolve-outcome` — with `consequence: 'by-target-reality'`, the registry-entry-only prerequisite law of amendment (4), and the guard-coverage instrument `tests/lint/opGuardCoverage.walker.test.js` + its `scripts/mutation-coverage-manifest.json` row. Depends on B1a. | ≈**83** + the walker | ✅ |

The split is collision-disjoint in everything but the one leaf, which B1b extends by appending
rows — so B1a must land first, and B1b's own arms re-assert B1a's totality so a dropped row reds.
⭐ **It also puts every byte of §934.43's work in one reviewable member**, which is what the owner's
ruling deserves.

**The whole-row contract is written out below anyway**, so that if the chair rejects the split the
packet is ready as one member and only §3 changes.

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1
```

Expected: exact packet Markdown and capsule emitted; ancestry and substrate proven; **CREATE
targets ABSENT** — `src/domain/edit/operations.js`, `tests/domain/editOperations.test.js` and
`tests/lint/opGuardCoverage.walker.test.js` measured absent at this base;
`scripts/mutation-coverage-manifest.json` present and **clean** (it is a MODIFY/REGISTER target);
every `requiredSymbols` row resolving; foreign dirt fingerprinted without target overlap.

⚠ **THIS WORKTREE IS SHARED AND THE BASE HAS MOVED TWICE DURING COMPILE.** Re-read
`git rev-parse HEAD` in the same command as the dispatch. A descendant is admissible only on the
measured docs-only clause, never assumed.

⚠ `scripts/mutation-coverage-manifest.json` is 704 rows and ~472 kB. Preflight must confirm no
sibling lane holds it dirty; a concurrent whole-file re-serialisation would bury this packet's
single row, which is the exact failure `PACKET_STANDARD.md` forbids.

Any mismatch makes this packet STALE. Stop before coding.

---

## 5. Verified tree contract

Every row found BY SYMBOL at `d31af2cee`; the proving command for each is in `EM-B1.evidence.md`.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **The rename cascade — the whole-settlement writer** | `src/domain/factionRename.js` | `applyFactionRenameToSettlement` | `(settlement, oldName, newName) → { changed: boolean, touched: string[] }`. Returns `{changed:false, touched:[]}` when the settlement is not a record, either name is falsy, **or `oldName === newName`** | The `rename-faction` op's declared writer. ⛔ **No second cascade** (HZ-JOINKEY) |
| **The cascade — the patch form** | `src/domain/factionRename.js` | `factionRenameChanges` | `(settlement, oldName, newName) → { changed, touched, changes: StoredRecord }`; deep-clones only `CASCADE_BUCKETS` present on the settlement | The form a store writer takes. Named so the op declares WHICH cascade entry point it means |
| **The cascade — NPC half** | `src/domain/factionRename.js` | `applyNpcRenameToSettlement`, `npcRenameChanges` | The same pair for `rename-npc`; `NPC_RENAME_SURFACES` is its own declared surface list | The `rename-npc` op's declared writer |
| **The join surfaces** | `src/domain/factionRename.js` | `FACTION_RENAME_SURFACES`, `NPC_RENAME_SURFACES` | Frozen declared lists, each row `{ path, kind, why }`; the NPC family is SPREAD across `NPC_HOMES` "so the two homes cannot drift — the drift IS the bug this replaced" | The evidence that a name is a JOIN KEY. EM-A3's census reads the same lists |
| **Faction resolution** | `src/domain/factionRename.js` | `resolveFactionForRename` | `(settlement, factionIndex)` — the one way to turn an index into the faction a rename targets | `makeOp`'s target resolution for `rename-faction` |
| **Totality writer** | `src/generators/power/rulingStructure.js` | `renormalizeFactionPower` | `(factions) → factions`. ⚠ **IT MUTATES IN PLACE** (`factions[s.i].power = s.floor`) and returns the SAME reference. Largest-remainder to an exact sum of 100, ties broken by current order. Returns the argument unchanged when the roster is empty or every power is ≤ 0 | Named as the **declared `fulfil` writer** of `rebalance-power`. ⛔ This packet CALLS it nowhere — EM-C3 does. Its in-place mutation is recorded here because a caller that assumed purity would corrupt a roster |
| ⛔ **REFUTED — a prose picker** | `src/generators/structuralValidator.js` | `checkInstCompat` | `(institutions, tier, _magicPriority) → string` — a keyword ladder returning a NARRATIVE SENTENCE via `pickRandom`. No boolean, no violations, and it CONSUMES A DRAW | Named because the charter names it and it exists. ⛔ **It is not the prerequisite rule's source.** F-B1 |
| **The real validity checker** | `src/generators/structuralValidator.js` | `checkStructuralValidity` | `(institutions, config = {}) → { violations, suggestions }` | The correction F-B1 hands EM-C3. This packet calls it nowhere |
| **The real prerequisite table** | `src/data/spatialData.js` | `GATE_FEATURES` | A live `requires` map — `Citadel` requires `City walls and gates` / `Massive walls…`; `Gates (if walled)` carries `suggestionOnly: true` and its own `reason` | The prerequisite rule's actual ground (EM-C3's). Named here so it is findable from this manifest |
| **Archetype vocabulary** | `src/domain/factionArchetypes.js` | `FACTION_ARCHETYPES` | Frozen 13 values | The `add-faction` / `set-field` payload schema's closed archetype type |
| **Stable order** | `src/domain/deterministicSort.js` | `compareCodepoint` | The estate's one sanctioned, locale-free string order | `OP_TYPES`' stable enumeration and every list `validateOp` reports |
| **Test precedent — domain** | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q — the institution founding year')` + seven straight-line `it` | One literal `describe`, no `.each`/`runIf`/nesting, positive control first | Copy for `tests/domain/editOperations.test.js` |
| **Test precedent — a registry walker** | `tests/lint/chooserTotality.walker.test.js` | `const SCAN_ROOTS`; HB-1's A7/A8 ("classified equals discovered both directions", "symbolsWithTwoDispositions empty") | A register walker asserts its table SET-EQUAL to the live scan in BOTH directions and reports a full offender list | Copy for `opGuardCoverage.walker.test.js` |
| **Register row shape** | `scripts/mutation-coverage-manifest.json` | `invariants` | 704 rows; kinds `rationale \| mutation \| uncovered`; a `rationale` row is `{ kind: 'rationale', rationale: '<the executed account>' }` | The exact shape of the one row this packet appends |

**Forbidden alternatives:**

- ⛔ **no second force-return mechanism.** A returning force resolves through the home's EXISTING
  muster / casualty / upkeep mechanics (EM-F1, wave 5). This packet writes none, names none as a
  write target, and must not grow one (chair amendment; design §13);
- ⛔ **no phantom-side state, ever** — no war state, treaty, trade route, envoy state,
  faction-power or legitimacy shift derived from a phantom (design §13; preamble §P8);
- no second rename cascade, archetype vocabulary, string order, PRNG stream or writer;
- **no adapter per op type** — EM-C4 adds exactly ONE generic decree adapter (§12.13);
- no import of `src/kernel/rngContext.js` (this leaf draws nothing), `src/components/**` or
  `src/store/**`;
- no edit to `src/domain/factionRename.js`, `src/generators/power/rulingStructure.js`,
  `src/generators/structuralValidator.js` or `src/data/spatialData.js` — **this packet modifies
  ZERO existing production files**;
- no whole-file re-serialisation of `scripts/mutation-coverage-manifest.json`;
- no files outside the manifest.

---

## 6. Exact contracts

### Inputs and outputs

```js
/** @typedef {import('./types.js').Op} Op */
/** @typedef {import('./types.js').EntityRef} EntityRef */

/** The closed stage vocabulary (ARCH §2 as amended by design §13). Frozen. */
export const OP_STAGES;            // readonly ['home', 'off-stage']

/** The closed consequence policies. Frozen. */
export const OP_CONSEQUENCE_POLICIES;   // readonly ['home', 'by-target-reality']

/** The catalogue. Frozen; every value carries EVERY field of the row schema below. */
export const OP_TYPES;             // Readonly<Record<string, OpTypeDeclaration>>

/**
 * Build one op. PURE: it reads no world, consumes no draw, and mints no id.
 * @param {string} type      must be a key of OP_TYPES
 * @param {EntityRef} target
 * @param {Record<string, unknown>} [payload]
 * @returns {Op|null}  null when `type` is not a key of OP_TYPES or `target` is not a
 *                     well-formed EntityRef. NEVER throws, NEVER returns a partial op.
 */
export function makeOp(type, target, payload);

/**
 * Judge one op against a world. PURE and TOTAL.
 * @param {Op|null|undefined} op
 * @param {unknown} world
 * @returns {{ ok: boolean, errors: readonly string[] }}
 *          `errors` is ALWAYS an array — frozen, codepoint-sorted, [] when ok.
 *          ok === (errors.length === 0), asserted as an invariant.
 */
export function validateOp(op, world);
```

### State schema — the op-type row, exactly

```js
/**
 * @typedef {{
 *   target: 'settlement'|'institution'|'npc'|'faction'|'power'|'phantom'|'section',
 *   payload: Readonly<Record<string, PayloadFieldSpec>>,
 *   stage: 'home'|'off-stage',
 *   consequence: 'home'|'by-target-reality',
 *   requires: readonly string[],
 *   enables: readonly string[],
 *   relatedTo: readonly string[],
 *   conflictsWith: readonly string[],
 *   duration: number|null,
 *   guards: readonly Function[],
 *   guardsStated: string,
 * }} OpTypeDeclaration
 *
 * @typedef {{ kind: 'pool'|'free'|'ref'|'int'|'enum', pool?: string,
 *   values?: readonly string[], required: boolean }} PayloadFieldSpec
 */
```

⛔ **EVERY FIELD IS REQUIRED ON EVERY ROW. None is optional, none may be omitted "when empty".**
An empty relation is `[]`; an absent duration is `null`; empty coverage is `guards: []` **plus a
non-empty `guardsStated`**. A row missing a field is a walker red (A7), not a default.

Absence rules:

- **absent** `type` / unknown type: `makeOp` → `null`; `validateOp(null)` →
  `{ ok: false, errors: ['op is absent'] }` (the exact string, frozen).
- **empty** relation array: legal and meaningful — "this type declares no relation of this kind".
- **`null`**: the `duration` value for "no duration"; forbidden everywhere else in a row.
- **invalid legacy input** (an op object from an older shape, a non-object, a string): rejected by
  `validateOp` with a named error; never repaired, never thrown on.

### THE PHANTOM CONSEQUENCE POLICY — the chair's amendment, spelled with no discretion

| clause | contract |
|---|---|
| **`stage`, exactly** | `off-stage` for **exactly seven** types: `declare-war`, `make-peace`, `open-trade`, `close-trade`, `send-force`, `recall-force`, `resolve-outcome`. `home` for **every other type**. The partition is TOTAL and asserted both directions (A3). |
| **`consequence`, exactly** | `'by-target-reality'` on exactly those seven; `'home'` on every other type. The two sets are the same partition, asserted by set-equality with `stage` (A3) so they can never drift apart. |
| **The resolver is NOT here** | Consequence is decided **at apply time** by `consequenceFor(target) → 'home-procedures+record' \| 'world'`, which **EM-F1 owns and this packet does not author, import or reference by import**. `operations.js` declares the POLICY as data and nothing more. ⛔ A `consequenceFor` implementation appearing in this packet is a STOP. |
| **What a phantom act may produce** | Only (a) the home's own EXISTING procedures on the home's own state, and (b) the chronicle line. **No war state, treaty, trade route, envoy state, faction-power or legitimacy shift.** This packet encodes that by declaring it and by writing no such effect; EM-E1 applies it. |
| **A real save** | The decree is handed to the campaign's inter-settlement machinery. That path is the simulator's; the editor only hands it over. |
| ⛔ **Relations must not assume phantom-side state** | `make-peace.requires` is **`['declare-war']` — a prior ENTRY IN THE REGISTRY**, never a war state in the world. The same law binds `recall-force` (requires the `send-force` ENTRY) and `close-trade` (requires the `open-trade` ENTRY). A relation naming a world predicate on an off-stage type is a walker red (A4). |
| **Promotion** | Out of scope here; design §13's closing clause (record-only outcomes stay record-only) is EM-F2's. |

### The declared relations — the four kinds, and what each means

- `requires[]` — op types (or, for **home** ops only, world predicates) that must precede this one.
  **For off-stage types, entries are op types ONLY** (the clause above).
- `enables[]` — the types this one makes available.
- `relatedTo[]` — types the catalogue marks as belonging together, which is what lets the
  connection guard OFFER a follows-from link (design §2.7a) without inventing anything.
- `conflictsWith[]` — types whose co-presence raises the `contradiction` guard.

⛔ **RELATIONAL INTEGRITY IS TOTAL AND SYMMETRIC WHERE IT MUST BE.** Every string in every relation
array is a key of `OP_TYPES` (A4). `conflictsWith` is **symmetric**: if X conflicts with Y then Y
conflicts with X, asserted both directions. `requires`/`enables` are **inverse**: if X is in
`Y.requires` then Y is in `X.enables`. `relatedTo` is **symmetric**. These are assertions, not
conventions, because a one-sided relation makes a guard fire for one ordering and not the other.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| — | `makeOp(type, target, payload)` with `type` in `OP_TYPES` and a well-formed `target` | none (pure) | an `Op` carrying the type's declared `stage` and relations | none |
| — | `makeOp` with an unknown type or malformed target | none | **`null`** | none |
| an `Op` | `validateOp(op, world)` | the type's payload schema + relational integrity | `{ ok: true, errors: [] }` | none |
| an `Op` | `validateOp` on a payload violation | — | `{ ok: false, errors: [<named, sorted>] }` | none |

⚠ **`validateOp` NEVER refuses an action** — it reports. Refusal is not this packet's to invent,
and the guards themselves never refuse either (design §2.7; preamble §P8). `ok: false` means "this
op is malformed", not "this op is disallowed".

### Ordering and precedence

- **Pipeline/tick position:** NONE. Pure leaf, outside generation and outside the pulse.
- **Same-tick visibility:** not applicable.
- **Merge/replace/deduplicate:** not applicable — this packet holds no collection of ops.
- **Stable enumeration:** `Object.keys(OP_TYPES)` is authored and asserted in `compareCodepoint`
  order, so the catalogue's iteration order is reproducible and a new row cannot be appended
  "wherever". `validateOp`'s `errors` are `compareCodepoint`-sorted.
- **Tie-break:** none needed; keys are unique.

### Determinism

- **Hash/fork key:** `NONE`. ⛔ This packet draws no random number. `makeOp` **mints no id** — the
  registry's `stage()` (EM-C1) assigns the entry id, and the DM-minted entity id is `mintDmId`'s
  (EM-B2). A PRNG import appearing in this leaf is a STOP.
- **Stable enumeration:** as above.
- **Rounding/clamping:** none; no float is produced or rendered.
- **No-draw behaviour:** the leaf imports nothing from `src/kernel/prng.js` or
  `src/kernel/rngContext.js`, so it cannot move any stream. A6 asserts the import list.

### Flag and dormancy

- **Flag:** `NONE` — wave 1 is headless; `TIER_GATE.premium.editMode` is EM-D1's.
- **Dormancy:** lands with **zero importers**; A6 proves it by source scan.
- **Golden posture:** `UNCHANGED`. `tests/property/generatorGoldenMaster.test.js` and
  `tests/property/dossierProseManifest.test.js` must not move by one byte — structurally, since
  nothing imports the leaf and it takes no draw. **Motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Frozen module constant | `OP_TYPES`, `makeOp`, `validateOp` — pure | **Never** — an `Op` is persisted only INSIDE a `Decree`, which is EM-B3's key and EM-B3's door | n/a | n/a | n/a | **None owed here.** An op shape change once decrees exist is a migration EM-B4 owns | **None** — no secret is read |

⚠ **THE OP SHAPE IS PERSISTED BY A LATER PACKET, WHICH IS WHY IT IS FROZEN HERE.** EM-B3 stores
`decrees: Decree[]`, and every `Decree` carries an `Op`. A field added to `OpTypeDeclaration` after
EM-B3 lands is a stored-shape change with a migration cost. That is the reason every field is
required rather than optional, and it is stated so the next author does not read the rigidity as
fussiness.

### Receipts and privacy

- **Closed kinds:** `NONE` — `validateOp` returns a typed result, not a receipt.
- **DM-only fields / public projection:** `NONE` — nothing here is persisted or projected by this
  packet. Those are EM-B3's (preamble §P2.6).

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: the op catalogue is a vocabulary of acts; it reads no alignment,
  law or temper axis and ranks nothing.`
- **Edit story:** `ENGINE-ONLY: the DM's verbs arrive at this catalogue from EM-D2's dialog through
  EM-C4's single adapter. This packet is the vocabulary underneath them and has no surface.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/operations.js` | `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `OP_TYPES`, `makeOp`, `validateOp` | **250 eff (cap); ≈267 estimated — see §3's STOP AND SPLIT** | The catalogue of §6 with every row carrying all ten declared fields. The seven off-stage types carry `stage:'off-stage'` + `consequence:'by-target-reality'` and prerequisites naming REGISTRY ENTRIES only. Import no PRNG, no `src/store/**`, no `src/components/**`. Author `consequenceFor` nowhere. |
| `CREATE` | `tests/domain/editOperations.test.js` | A1–A6, A8 | `n/a` | ONE literal `describe`, straight-line `it`, no `.each`/`runIf`/nesting (preamble §P3.4). Table arms report a FULL offender list. Negatives carry `// anchored:` on the line immediately above. |
| `CREATE` | `tests/lint/opGuardCoverage.walker.test.js` | A7 | `n/a` | The coverage walker: every `OP_TYPES` row declares `guards` (an array) AND a non-empty `guardsStated`; the declared set SET-EQUALS the live scan both directions (the `chooserTotality` shape); a declared rule that is not a function reds. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | ONE new `invariants` row keyed `tests/lint/opGuardCoverage.walker.test.js` | `+1 row` | ⛔ Added **SURGICALLY beside its siblings**, never by re-serialising the file. Kind `rationale`, carrying the EXECUTED mutant account (§8 step 6). 704 rows → 705. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the tuple in `tests/lint/.lighting-census-baseline.json` | `n/a` | ⛔ **DEFERRED TO THE TRAIN TERMINAL** — the member does NOT edit this file. See the box below. |

Generated artifacts: `NONE`.

⛔ **EDGE-SHARED BUNDLE CLOSURE: NOT OWED.** This packet MODIFIES zero existing production files,
so no closure input moves and no `*.freshness.test.js` can go stale. Resolved at compile.

No other file may be edited.

### The registration ledger — every obligation priced

| # | Obligation | Verdict | The measurement |
|---|---|---|---|
| P2.1 | sovereignty-lighting census | **OWED — `+2 files`, an INTERIOR RED** | The walker's `files` is `TEST_FILES.length` over `tests/**/*.test.js` (`:515`, `:612`) — it counts TEST files, so the drivers are `tests/domain/editOperations.test.js` and `tests/lint/opGuardCoverage.walker.test.js`, **not** the `src/domain` leaf (the same refutation EM-A2 records as F3). From `2645 / 383 / 2262 / 25009 / 6670`, predicted `+2 files / +0 parked / +2 credited / +8 titles / +2 suiteTitles`. |
| P2.2 | `scripts/mutation-coverage-manifest.json` row | ⛔ **OWED — and it is this packet's, priced here** | `tests/lint` is the first of the ENFORCER DIRS (`tests/lint/mutationCoverage.shared.mjs:36-37`) and `tests/lint/mutationCoverageManifest.test.js` asserts every enumerated file owns an `invariants` entry. `tests/lint/opGuardCoverage.walker.test.js` is a new file there, so the row is owed **at compile**, in this manifest. It is the obligation `PACKET_STANDARD.md` records as having been discovered at a terminal twice. |
| P2.3 | observed-shape `EXPLAINED_WRITER_EXEMPTIONS` | **NOT OWED** | The door is for a new domain reader of a save-time key (`dmLayer`, `decrees`). This packet reads neither and persists nothing. `check-observed-shape-readers.mjs` scans every `.js`/`.jsx` under `src/` (`:250`) so the leaf IS scanned; the check is in `checks` so motion convicts. |
| P2.4 | `scripts/check-writer-reach.mjs` | **CANNOT MOVE — measured** | `SURFACE_CLOSURE_STOP` (`scripts/lib/writer-reach-scan.mjs:115-117`) includes `'src/store/'`; `operations.js` reaches a surface only through `src/store/editSlice.js` (EM-C4), and the closure halts at the store. |
| P2.5 | decision-fork / mechanism-coverage rows | **NOT OWED** | This packet mints **no seeded chooser and no pool** — it draws nothing at all. (Even had it, `chooserTotality`'s `SCAN_ROOTS` are four worldPulse-family dirs and `src/domain/edit` is not among them — EM-A2's R5.) |
| P2.7 | prose-numerics | **NOT OWED** | No figure is rendered. |

> ⛔ **THE SHARED CENSUS ROW IS DEFERRED (the §417 / MF-T2Q shape).** Every wave-1 EM member that
> adds a test file owes the same walker re-record, and `scripts/implementation-packets.mjs`
> refuses one `changeManifest` path claimed by more than one NON-TERMINAL packet — **DRAFT
> reserves exactly as READY does.** This member makes **no edit** to the walker and hands the chair
> the exact row for the landing act:
>
> ```json
>         {
>           "action": "TEST",
>           "path": "tests/lint/sovereigntyLightingContract.walker.test.js"
>         }
> ```
>
> ⚠ **INTERIOR RED, NAMED IN ADVANCE.** Until the terminal re-derives the census,
> `tests/lint/sovereigntyLightingContract.walker.test.js` reds at this member's tip with the
> message shape `the estate's file count moved — re-measure, do not re-word: expected 2647 to be 2645`.
> ⭐ **`EM-B1.manifest.json` therefore OMITS that path** while a sibling holds it non-terminally;
> the chair inserts it once, at the terminal.

---

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch; re-read `git rev-parse HEAD` in the same
   command (the base has moved twice already). Confirm
   `scripts/mutation-coverage-manifest.json` is clean.
1. Capture the baseline: the five census figures from `tests/lint/.lighting-census-baseline.json`;
   `sha256` of `tests/fixtures/generator-golden-master.json`; the `invariants` row count (704).
2. Add both test files with A1–A8 **failing**.
3. Implement the pure data contract: `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, the payload-spec
   vocabulary, then `OP_TYPES` — the home rows first, then the seven off-stage rows with the
   §934.43 policy.
4. Implement `makeOp`, then `validateOp`.
5. Extend the sole writer / wire consumers: **NOT APPLICABLE** — no writer, no consumer; the leaf
   lands DARK. Record both steps as skipped.
6. Add the prevention guard (`opGuardCoverage.walker.test.js`) and **then** its
   `scripts/mutation-coverage-manifest.json` row — written only AFTER the mutants of §9 are
   executed, because the row's `rationale` must carry the EXECUTED account, never a predicted one.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan and write the completion receipt.

Bounded algorithm — `validateOp`:

```text
1. if op is not a plain object            -> { ok:false, errors:['op is absent'] }
2. decl = OP_TYPES[op.type]
   if !decl                               -> errors += `unknown op type: ${op.type}`
3. if op.target is not { kind, id } with kind in the closed EntityRef set
                                          -> errors += 'target is malformed'
4. for each [field, spec] of decl.payload:
     if spec.required && op.payload?.[field] === undefined
                                          -> errors += `payload.${field} is required`
     if present and spec.kind === 'enum' and the value is not in spec.values
                                          -> errors += `payload.${field} is not one of the declared values`
5. for each key of op.payload not in decl.payload
                                          -> errors += `payload.${key} is not declared for ${op.type}`
6. errors.sort(compareCodepoint); freeze
7. return { ok: errors.length === 0, errors }
```

⛔ Step 7's `ok` is DERIVED from `errors`, never set independently — A8 asserts the invariant, so
the two can never disagree.

---

## 9. Acceptance matrix

Seven arms in `tests/domain/editOperations.test.js`, one (A7) in
`tests/lint/opGuardCoverage.walker.test.js`.

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| **A1** | **Main behaviour + GUARD-THE-GUARD, first** | `OP_TYPES` | The catalogue holds exactly the declared set (23 pending R1), set-equal both directions with a full offender list. **Every row carries all ten fields**, each of the declared type, with `guardsStated` non-empty — asserted BEFORE any negative below so no arm can pass on nothing. `Object.keys(OP_TYPES)` is in `compareCodepoint` order. `makeOp('set-field', {kind:'institution',id:'i1'}, {...})` returns an `Op` carrying the type's declared `stage`, `consequence` and four relations. | `tests/domain/editOperations.test.js` |
| **A2** | **Absence and malformed input — nothing throws** | unknown type, `null` target, `{kind:'nonsense'}`, a string op, `undefined`, a payload with an undeclared key | `makeOp` returns **`null`** for each; `validateOp` returns `{ok:false, errors:[…]}` with the NAMED error and never throws. `validateOp(null)` returns exactly `errors: ['op is absent']`. A required payload field omitted names that field; an enum value outside `spec.values` names that field. | same |
| **A3** | **⛔ THE §934.43 PARTITION, TOTAL AND IN BOTH DIRECTIONS** | `OP_TYPES` | The `stage:'off-stage'` set is **exactly** `{declare-war, make-peace, open-trade, close-trade, send-force, recall-force, resolve-outcome}` — asserted as an exact sorted list, not a length. Every other type is `stage:'home'`. The `consequence:'by-target-reality'` set **SET-EQUALS the off-stage set** and `consequence:'home'` equals the home set, so the two fields can never drift. Counterforce: a source scan proves `consequenceFor` is **defined nowhere** in this module — the resolver is EM-F1's. | same |
| **A4** | **⛔ RELATIONAL INTEGRITY, AND NO PHANTOM-SIDE PREREQUISITE** | every relation array | Every string in every `requires`/`enables`/`relatedTo`/`conflictsWith` is a key of `OP_TYPES` (full offender list). `conflictsWith` is symmetric both directions; `requires`/`enables` are exact inverses; `relatedTo` is symmetric. ⭐ **For every off-stage type, `requires` contains only op-type keys and no world predicate** — asserted by name, with `make-peace.requires` pinned to exactly `['declare-war']` (the REGISTRY ENTRY, never a war state), and the same for `recall-force` and `close-trade`. | same |
| **A5** | **Boundary / sparse — the rename ops run the existing cascade and nothing else** | the three `rename-*` types | Each declares `target` of the right kind, a single required name field, `stage:'home'`, `consequence:'home'`, and names the existing cascade as its declared writer. A source scan proves this module **defines no rename logic of its own** and does not re-implement any path in `FACTION_RENAME_SURFACES` — the join-key law is honoured by delegation (HZ-JOINKEY), with the matcher proved live on a planted string. | same |
| **A6** | **Purity, dormancy and the import fence (the counterforce)** | `operations.js` source | `makeOp` and `validateOp` are proved pure: the same inputs give `toEqual` results, the input `payload` object is proved unmutated (a deep-equal check against a pre-call clone), and calling them 100 times changes nothing observable. The import list is asserted EXACTLY and contains **none of** `src/kernel/prng.js`, `src/kernel/rngContext.js`, any `src/store/**`, any `src/components/**`, and **no force/muster/casualty/upkeep module**. A source scan over `src/**` finds **zero importers** of this leaf, with guard-the-guard arms on both the walk and the matcher. | same |
| **A7** | **THE GUARD-COVERAGE WALKER (the prevention guard)** | `OP_TYPES` | Every type declares `guards` as an ARRAY and a non-empty `guardsStated` string; the declared coverage set SET-EQUALS the live scan in BOTH directions (the `chooserTotality` shape) with a full offender list; a declared entry that is not a function reds; a type whose `guards` is non-empty but whose `guardsStated` claims emptiness reds. Guard-the-guard: the walk is asserted non-empty first. | `tests/lint/opGuardCoverage.walker.test.js` |
| **A8** | **THE `ok`/`errors` INVARIANT, and the report-never-refuse law** | a table of valid and invalid ops | For every case, `result.ok === (result.errors.length === 0)` — the two can never disagree. `errors` is FROZEN and `compareCodepoint`-sorted (a case producing three errors is asserted in exact sorted order). ⭐ And the product law: a WELL-FORMED off-stage op against a phantom target validates `ok: true` — `validateOp` reports malformation only and **never refuses an act**, because at this table a god sits (design §2.7; preamble §P8). | `tests/domain/editOperations.test.js` |

This table is the entire edge-case budget: **8 of ≤8**, and the §934.43 policy is folded into A3,
A4 and A8 rather than adding a case, exactly as the chair's amendment clause (5) directs.

---

## 10. Verification commands

```sh
# Focused static checks
npx eslint src/domain/edit/operations.js tests/domain/editOperations.test.js \
  tests/lint/opGuardCoverage.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict          # src/domain/edit/** must be strict-clean (preamble §P4)

# Focused tests — ONE test directory per gated run, the slot held for the whole process
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editOperations.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/opGuardCoverage.walker.test.js tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js

# The golden/dormancy proof — UNCHANGED is the required result
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

# The cascade suites this packet delegates to, proved unmoved
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/factionRename.test.js

# Registers verified plain at the tip
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-B1
npm run implementation:resume -- EM-B1

# Wave-end: the train's terminal runs the bare gate. A member never runs `npm run check`.
```

⚠ `tests/domain/factionRename.test.js` is named from the estate's naming convention and **must be
resolved by the implementer at preflight** (`ls tests/domain | grep -i rename`); this lane did not
measure it, and an unmeasured path is not a verified fact. If it does not exist, drop that
invocation and say so in the receipt.

Expected: every command exits `0`, **except** the one inherited row named in §7 —
`tests/lint/sovereigntyLightingContract.walker.test.js`, a NAMED interior red until the terminal.
⛔ Never read a gate through a shell pipe (preamble §P7).

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and preamble §P8, stop if:

- the dispatch seal is missing, invalid, or belongs to another worktree state;
- **HEAD is not `d31af2cee` or a descendant proved non-interfering by execution**;
- `src/domain/edit/operations.js` measures **> 250 effective lines** under eslint's own `Linter`
  with `skipBlankLines` and `skipComments` → take §3's **B1a / B1b** split; never renegotiate;
- `scripts/mutation-coverage-manifest.json` would need re-serialising whole, or is dirty from
  another lane;
- **any phantom-side world state appears necessary** — a war state, a treaty, a trade route, an
  envoy state, or a faction-power/legitimacy shift derived from a phantom (design §13; preamble §P8);
- **a second force-return mechanism appears necessary** — the home's existing muster/casualty/
  upkeep mechanics are the only path, and they are EM-F1's to wire;
- `consequenceFor` would need to be authored, imported or referenced here;
- an off-stage type's `requires` would need a world predicate rather than a registry ENTRY;
- an adapter per op type appears necessary (§12.13 — EM-C4 adds exactly one);
- a PRNG or `rngContext` import appears necessary — this leaf draws nothing;
- a golden or the prose manifest moves by one byte;
- `renormalizeFactionPower` is found to be pure (it is not — it mutates in place), or
  `applyFactionRenameToSettlement`'s return shape has changed;
- R1's op-type count is answered in a way that changes the catalogue's membership.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the
next wave.

---

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (`operations.js` measured with eslint's `Linter`):
- Acceptance cases A1–A8, executed and passed:
- Focused commands, exits and counts:
- The mutants planted, convicted and restored digest-exact (§P6), with the account copied into the
  `mutation-coverage-manifest.json` row:
- `invariants` row count before and after (704 → 705), and proof the file was NOT re-serialised
  (a `git diff --stat` of one changed hunk):
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result (the fixture digest, before and at the tip):
- Census tuple before and at the tip, with the interior red quoted verbatim:
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`

---

## 13. RAISED — questions only the chair can answer

| # | Item | For the chair |
|---|---|---|
| **R0** | **The base moved twice during compile** — `d31af2cee` → `02968876b` → `a03ebb09a`, five commits over six files, all measured paths blob-identical. The packet holds `d31af2cee`. | Re-pin to `a03ebb09a`, or confirm `d31af2cee`. |
| **R1** | ⛔ **THE OP-TYPE COUNT, and it moves the budget.** ARCH §9's closed list of twenty contains **no rename op**, but design §12.3 (governing) mandates `rename-faction`, `rename-npc` and `rename-settlement`, and the charter's own EM-B1 row says "`rename-*` ops call the existing cascade". The packet specifies **twenty-three** and displaces none. | Ratify 23; or name the three types that leave; or rule the renames a separate member. |
| **R2** | ⛔ **`checkInstCompat` IS A PROSE PICKER (F-B1).** It returns a narrative sentence via `pickRandom` — no boolean, no violations, and it consumes a draw. The real prerequisite ground is `checkStructuralValidity` → `{violations, suggestions}` plus `GATE_FEATURES`'s live `requires` table. EM-B1 calls none of them, so it is not blocked — but **EM-C3's charter row names the wrong symbol** and its compiler will build the prerequisite rule on a sentence generator. | Amend the charter's EM-C3 row (and design §12.8 / ARCH §5) to name `checkStructuralValidity` + `GATE_FEATURES`, or rule otherwise before EM-C3 compiles. |
| **R3** | ⛔ **THE STOP AND SPLIT (§3), on two grounds:** the leaf estimates ≈267 effective against a 250 cap at 23 types (≈234 at 20), and the chair's own §934.43 amendment draws a real family line between the sixteen home ops and the seven off-stage ops. The proposed split is **EM-B1a** (machinery + home ops, ≈215) and **EM-B1b** (the seven off-stage ops under §13 + the coverage walker + its register row, ≈83). | Approve the split as proposed; or direct a different line; or rule the single member and accept the re-measurement at implementation with §11's STOP standing. |
| **R4** | **Preamble §P2.1's census premise is refuted** — the walker's `files` counts `tests/**/*.test.js`, not files under `src/`. This packet's `+2` is driven by its two test files. (EM-A2 raises the identical point as its R4; one amendment answers both.) | Amend §P2.1's wording, or record the correction in the train plan only. |
| **R5** | **`tests/domain/factionRename.test.js` is named in §10 from convention and was NOT measured by this lane.** | Confirm the real path, or let the implementer resolve it at preflight and record it in the receipt. |
