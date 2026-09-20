# Settlement editor / EM-B1a — the op vocabulary and the eighteen HOME ops: one constructor, one validator, and the stage partition asserted set-equal

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠ Ten commits moved the branch under this lane (11:01→11:33 EDT), all docs plus `.gitignore` and
  one edit to an existing test file. `d31af2cee` **IS an ancestor** of `7aa769830`, and **every
  path this packet measures is blob-identical across the window** (evidence §0). Held at
  `d31af2cee` per the chair's ruling (6): the chair re-pins every packet at promotion.
- **Last revalidated:** 2026-09-19 11:33 EDT, `d31af2cee`
- **Depends on:** **`EM-B1e`** (the pulse's one exported `ruinInstitution` — this packet's `ruined` arm calls it; ODQ §934.47 add. 7), **`EM-B1d`** (the vocabulary growth — see §15; it lands FIRST so this packet's
  two enum rows read the seven and the six) and `EM-A1` (`src/domain/edit/types.js` — the `Op` and `EntityRef` typedefs this
  packet's JSDoc references). EM-A1 must land FIRST or the typedef imports have no home.
- **Collision group:** `EM-B1b`, which **appends the seven off-stage rows to this packet's
  `OP_TYPES`**. B1a lands FIRST; B1b's arms re-assert B1a's totality so a dropped row reds.
  Measured: all 182 registered packets are TERMINAL, so nothing in the manifest reserves any path.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: `factionRename.js` exports twelve symbols;
  `renormalizeFactionPower` **mutates in place** and returns the same array reference;
  `checkInstCompat` returns a **prose sentence** via `pickRandom`; `checkStructuralValidity`
  returns `{ violations, suggestions }`; `GATE_FEATURES` is the live `requires` table;
  `FACTION_ARCHETYPES` 13. Census tuple `2645 / 383 / 2262 / 25009 / 6670`. No test was run.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
  ⓘ Per the chair's ruling (6) this lane does not stamp it; the hash has moved with each ruling.

---

## 1. Reconciled authority

1. ⭐ **ODQ §934.50 / design §18 — PRECONDITIONS ON THE SEALS.** An op's `requires` splits into
   `{ world: [...], registry: [...] }`: the world half is named pure predicates that decide which
   seals a card OFFERS; the registry half stays the guards' suggestive ordering condition. §16
   carries the measured predicate roster and the two structural consequences.
2. **THE CHAIR'S RULINGS, 2026-09-19** (ODQ §934.36 addendum, §934.46): **(1)** EM-B1 **SPLITS** —
   this packet is **B1a**: the machinery (`makeOp`, `validateOp`, the `stage`/`consequence`
   partitions asserted set-equal) plus the HOME ops; the seven off-stage ops and the coverage
   walker are **EM-B1b's**. **(2)** The home set gains `set-npc-status`, `set-institution-state`
   (design §15) and `set-world-fact` (design §14 final — **B1a only DECLARES the op and its
   payload shape; the engine is EM-B2's**), and **`set-state` is STRUCK**. **(6)** the base stays
   `d31af2cee`. **(7)** the `checkInstCompat` finding is accepted and the charter's EM-C3 row is
   corrected to `checkStructuralValidity` + `GATE_FEATURES`. **(8)** the census counts test files.
2. ⭐ **ODQ §934.47 ADDENDUM 6 (ledger `427aa5f00`) — THE EDITOR WRITES THE TREE'S EXISTING
   SHAPES.** On lane P2's measurement that `ruined` is the PULSE's own live vocabulary in 22 files
   and that `rosterProvenance.js:210` keeps it deliberately apart from the composer's
   `STATUS_REMOVED` set, **`EntityStatus` is NOT widened.** Instead `set-institution-state` offers
   the pool of five and writes **two different shapes by value** (§6). No union changes, so **no
   behaviour-shift measurement is owed**, and **this packet's budget is unchanged — a contract,
   not a file.**
3. **ODQ §934.43 / design §13 — the phantom consequence rule.** `Op` carries
   `stage?: 'home'|'off-stage'`; **every type in this packet is `home`**, and the partition's
   other half is B1b's. Consequence is decided at apply time by `consequenceFor(target)`, which
   **EM-F1 owns** and this packet neither authors nor imports.
3. **ODQ §934.46 / design §15** — NPC `status` and institution `state` are typed roots from a
   pool, **FINITE-SEMANTICS, never free text**; destruction is a state the record keeps, removal is
   erasure; *"the readers that consume them are named in the packet that adds each field."*
4. **ODQ §934.45 / design §14 FINAL** — a world fact, once the city exists, is edited **without
   re-rolling**: the change re-derives computed facts with every chosen fact pinned. The engine is
   `rederive(record, config′, layer)` and it is **EM-B2's, the load-bearing packet**.
5. **THE PROMISE** — lived history is immutable; an applied decree reopens read-only.
6. **design §12 GOVERNS** — §12.3 names are JOIN KEYS (a rename is a typed op running the existing
   cascade); §12.13 ONE generic decree adapter, never twenty.
7. **`EM-PREAMBLE.md`** §P2–§P5 (HZ-JOINKEY, HZ-PHANTOM, HZ-DERIVED), §P8 — cited by hash.
8. **ARCH §1, §2 (the amended `Op`), §5, §9 (the amended op list).**
9. Live code at `d31af2cee`.

**Resolved contradictions:**

- The op-type count. ARCH §9 now reads *"Op types (twenty-five, in two packets)"* and names the
  **eighteen HOME** types explicitly, including the three `rename-*` ops and striking `set-state`.
  The lane's earlier R1 (20 vs 23) is **CLOSED by the chair's ruling (2) and the amended ARCH**.
- `checkInstCompat` as the prerequisite rule's ground — **CLOSED by ruling (7)**; the correction is
  carried in this packet's `requiredSymbols` so EM-C3's compiler finds it.

---

## 2. Outcome

**Observable result:** `src/domain/edit/operations.js` is the estate's single typed vocabulary of
what a DM may do to a settlement at home: eighteen op types, each declaring its target kind,
payload schema, stage, consequence policy and four typed relations; `makeOp` builds one;
`validateOp` judges one; nothing anywhere constructs an op another way.

**Definition of done:** `OP_TYPES` holds exactly the eighteen home types of §6; every row carries
all ten declared fields, none absent, none undeclared; `makeOp` / `validateOp` have the exact
signatures of §6; every type is `stage: 'home'` and `consequence: 'home'`, with the two partitions
asserted set-equal; relational integrity is total and symmetric; the leaf lands DARK.

In scope: (1) the vocabulary with `makeOp` / `validateOp`; (2) no integration — headless, the
first consumer being EM-C4's single generic adapter; (3) the relational-integrity arm (A4), which
keeps a one-sided relation from making a guard fire for one ordering and not the other.

Explicit non-goals: **EM-B1b's** seven off-stage ops, the `stage: 'off-stage'` half and
`tests/lint/opGuardCoverage.walker.test.js` with its mutation-coverage row; the guard RULES
(EM-C3) and the folding engine (EM-C2); **`consequenceFor`** (EM-F1); **`rederive` and every
pin/re-derivation mechanic** (EM-B2) — this packet declares `set-world-fact`'s payload shape and
nothing more; the registry (EM-C1), the layer (EM-B2), the persisted keys (EM-B3), the tick
(EM-E1); any golden, tuning, migration or paid-surface behaviour.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | `1` | ≤2 |
| Existing logic-bearing production files modified | `0` | ≤3 |
| Additional registration-only files | `0` | ≤3 |
| Handwritten files total | `2` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≈231–249 (estimate range)** | ≤400 |
| **Effective lines per new leaf** | ⚠ **≈231–249 of 250 — inside, with ≤19 lines of margin** | ≤250 |
| Delta in a shared/hot file | `0` — names no hot file | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE`. **HOT FILES: none named.**

**The arithmetic, re-counted at eighteen home ops per ruling (2):** each row declares ten fields
and costs 8–9 effective lines written tightly ⇒ **144–162**; plus `makeOp` ≈ 15, `validateOp` ≈ 40
(the seven-step algorithm of §8), the closed vocabularies (`OP_STAGES`,
`OP_CONSEQUENCE_POLICIES`, target kinds, the payload-spec kinds) ≈ 12, helpers and freezing ≈ 15,
imports ≈ 5 ⇒ **≈231 at the low end, ≈249 at the high end.**

⚠⚠ **IT FITS, AND THE MARGIN IS THIN — SO THE NEXT SPLIT IS PRE-DECLARED RATHER THAN DISCOVERED.**
The chair's instruction was explicit: *if over, propose the next split line; do not squeeze.* The
estimate is not over, so the packet stands whole — but at 249 there is one line of room, and the
estate's hot-file lesson is that an estimate wrong in the dangerous direction authorizes a bad
edit. **If implementation measures the leaf over 250, take EM-B1c:** the three `rename-*` ops plus
`set-world-fact` (four rows, ≈36 effective) move out, leaving B1a at ≈195–213. That line is
principled rather than arbitrary — those four are exactly the rows that delegate to machinery
another packet owns (the rename cascade; EM-B2's `rederive`), while the other fourteen are
self-contained roster and field ops. **§11 makes crossing 250 a STOP, never a squeeze.**

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1a
```

Expected: capsule emitted; ancestry and substrate proven; **CREATE targets ABSENT**
(`src/domain/edit/operations.js`, `tests/domain/editOperations.test.js` — measured absent); no
non-CREATE production target; every `requiredSymbols` row resolving.

⚠ **THE WORKTREE IS SHARED AND THE BASE HAS MOVED TEN TIMES DURING COMPILE.** Re-read
`git rev-parse HEAD` in the same command as the dispatch; a descendant is admissible only on the
measured docs-only clause with blob-identity proven, never assumed.

---

## 5. Verified tree contract

Every row found BY SYMBOL at `d31af2cee`; commands in `EM-B1a.evidence.md`.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **The rename cascade — whole-settlement writer** | `src/domain/factionRename.js` | `applyFactionRenameToSettlement` | `(settlement, oldName, newName) → { changed: boolean, touched: string[] }`; returns `{changed:false, touched:[]}` when the settlement is not a record, either name is falsy, **or `oldName === newName`** | `rename-faction`'s declared writer. ⛔ **No second cascade** (HZ-JOINKEY) |
| **The cascade — patch form** | `src/domain/factionRename.js` | `factionRenameChanges` | `(settlement, oldName, newName) → { changed, touched, changes: StoredRecord }`; deep-clones only the `CASCADE_BUCKETS` present | The form a store writer takes; named so the op declares WHICH entry point it means |
| **The cascade — NPC half** | `src/domain/factionRename.js` | `applyNpcRenameToSettlement`, `npcRenameChanges` | The same pair for `rename-npc` | `rename-npc`'s declared writer |
| **The join surfaces** | `src/domain/factionRename.js` | `FACTION_RENAME_SURFACES`, `NPC_RENAME_SURFACES` | Frozen declared lists, each row `{ path, kind, why }`; the NPC family is SPREAD across `NPC_HOMES` *"so the two homes cannot drift — the drift IS the bug this replaced"* | The evidence a name is a JOIN KEY; EM-A3's census reads the same lists |
| **Faction resolution** | `src/domain/factionRename.js` | `resolveFactionForRename` | `(settlement, factionIndex)` — the one way to turn an index into the faction a rename targets | `makeOp`'s target resolution for `rename-faction` |
| **Totality writer** | `src/generators/power/rulingStructure.js` | `renormalizeFactionPower` | `(factions) → factions`. ⚠ **MUTATES IN PLACE** (`factions[s.i].power = s.floor`) and returns the SAME reference; largest-remainder to an exact 100, ties by current order; returns the argument unchanged on an empty or all-zero roster | Declared as `rebalance-power`'s `fulfil` writer. ⛔ **Called nowhere here** — EM-C3 calls it. The mutation is recorded because a caller assuming purity would corrupt a roster |
| ⛔ **REFUTED — a prose picker** | `src/generators/structuralValidator.js` | `checkInstCompat` | `(institutions, tier, _magicPriority) → string` — a keyword ladder returning a NARRATIVE SENTENCE via `pickRandom`. No boolean, no violations, and it **consumes a draw** | Named because it exists and the finding is accepted (ruling 7). ⛔ Not the prerequisite rule's source; called nowhere |
| **The real validity checker** | `src/generators/structuralValidator.js` | `checkStructuralValidity` | `(institutions, config = {}) → { violations, suggestions }` | Half of ruling (7)'s correction; EM-C3's ground. Called nowhere here |
| **The real prerequisite table** | `src/data/spatialData.js` | `GATE_FEATURES` | A live `requires` map — `Citadel` requires `City walls and gates` / `Massive walls…`; `Gates (if walled)` carries `suggestionOnly: true` and its own `reason` | The other half of ruling (7)'s correction. Called nowhere here |
| **The category vocabulary** | `src/domain/factionArchetypes.js` | `FACTION_ARCHETYPES` | Frozen 13 values, executed. ⭐ Its sibling `factionArchetype(f)` (`:103`) **DERIVES** the archetype from `f.category` | `add-faction` / `set-field`'s closed **`category`** payload type — never `archetype`, which is a derivation |
| **The seat flag and the derived name** | `src/generators/power/rulingStructure.js` | the `powerStructure` construction at `:787` | `governingName: (factions.find((f) => f.isGoverning) \|\| {}).faction \|\| null`, with the file's own comment: *"it must always name the faction entry that carries `isGoverning`"* | ⛔ THE REASON `set-power-holder` MOVES THE FLAG, NOT THE NAME |
| **The transfer of power** | `src/domain/rulingPower.js` | the return at `:657` | `governingName: toGovernment, government: toGovernment`, beside `previousGovernments` and `publicLegitimacy` — the ONE path that moves a seat and keeps both fields in step | **`set-power-holder`'s declared writer** |
| **NPC status vocabulary** | `src/domain/entities/npcs.js` | `NpcStatus` (typedef, `:30`) | `'active'\|'dead'\|'missing'\|'exiled'\|'retired'\|'removed'` — **six, and no `jailed`** | `set-npc-status`'s closed enum |
| **The NPC writers** | `src/domain/entities/npcs.js`, `src/domain/events/mutateEntities.js` | `createNpc`, `killNpc`, `assignNpcToRole`; the `mutateEntities` export block | The ops layer's existing status writers (`status: input.status \|\| 'active'` `:133`; `status: 'dead'` `:159`) | ⛔ **The op's writer. Never a second path** |
| **Institution state vocabulary** | `src/domain/entities/status.js` | `EntityStatus` (typedef, `:23`) | `'active'\|'impaired'\|'removed'\|'destroyed'\|'vacant'` — **five**, each with its authored gloss | `set-institution-state`'s closed enum |
| **Stable order** | `src/domain/deterministicSort.js` | `compareCodepoint` | The estate's one sanctioned, locale-free string order | `OP_TYPES`' key order and `validateOp`'s `errors` order |
| **Test precedent** | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q — the institution founding year')` + seven straight-line `it` | One literal `describe`, no `.each`/`runIf`/nesting, positive control first | Copy this proof shape (§P3.4) |
| **Test precedent (registry)** | `tests/lint/chooserTotality.walker.test.js` | `const SCAN_ROOTS`; HB-1's A7/A8 | A register arm asserts its table SET-EQUAL to the live scan in BOTH directions with a full offender list | Copy for A1/A3/A4's totality arms |

**Forbidden alternatives:**

- ⛔ **no second force-return mechanism** (chair amendment, design §13) — this packet writes none
  and names none as a write target;
- ⛔ **no phantom-side state, ever** — no war state, treaty, trade route, envoy state,
  faction-power or legitimacy shift derived from a phantom (§P8);
- ⛔ **no `rederive`, no pin machinery, no re-derivation of any kind** — `set-world-fact` DECLARES
  a payload and nothing more; the engine is EM-B2's (HZ-DERIVED);
- no second rename cascade, archetype vocabulary, string order, PRNG stream or writer;
- **no adapter per op type** — EM-C4 adds exactly ONE (§12.13);
- no import of `src/kernel/prng.js`, `src/kernel/rngContext.js`, `src/components/**` or
  `src/store/**`;
- no edit to `factionRename.js`, `rulingStructure.js`, `structuralValidator.js` or
  `spatialData.js` — **this packet modifies ZERO existing production files**;
- no files outside the manifest.

---

## 6. Exact contracts

### Inputs and outputs

```js
/** @typedef {import('./types.js').Op} Op */
/** @typedef {import('./types.js').EntityRef} EntityRef */

/** The closed stage vocabulary (ARCH §2 as amended by design §13). Frozen. */
export const OP_STAGES;                 // readonly ['home', 'off-stage']

/** The closed consequence policies. Frozen. */
export const OP_CONSEQUENCE_POLICIES;   // readonly ['home', 'by-target-reality']

/** The catalogue. Frozen; every value carries EVERY field of the row schema. */
export const OP_TYPES;                  // Readonly<Record<string, OpTypeDeclaration>>

/**
 * Build one op. PURE: reads no world, consumes no draw, mints no id.
 * @returns {Op|null}  null when `type` is not a key of OP_TYPES or `target` is not a
 *                     well-formed EntityRef. NEVER throws, NEVER returns a partial op.
 */
export function makeOp(type, target, payload);

/**
 * Judge one op against a world. PURE and TOTAL.
 * @returns {{ ok: boolean, errors: readonly string[] }}
 *          `errors` is ALWAYS a frozen, codepoint-sorted array — [] when ok.
 *          ok === (errors.length === 0), asserted as an invariant.
 */
export function validateOp(op, world);
```

⭐ **`OP_STAGES` and `OP_CONSEQUENCE_POLICIES` carry BOTH values even though this packet uses only
one of each.** The vocabularies are the partition's definition and B1b appends rows against them;
minting them half-populated would force B1b to edit a frozen constant, which is the second-home
mistake. A3 asserts both vocabularies exact and asserts that **every row in THIS packet uses the
`home` member**, so the unused members are declared but provably unreached at this tip.

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

⛔ **EVERY FIELD IS REQUIRED ON EVERY ROW. None is optional; none may be omitted "when empty."**
An empty relation is `[]`; an absent duration is `null`; empty coverage is `guards: []` **plus a
non-empty `guardsStated`**. A row missing a field is an A1 red, not a default.

⚠ **THE OP SHAPE IS PERSISTED BY A LATER PACKET, WHICH IS WHY IT IS RIGID.** EM-B3 stores
`decrees: Decree[]` and every `Decree` carries an `Op`. A field added after EM-B3 lands is a
stored-shape change with a migration cost. The rigidity is priced, not fussiness.

### The eighteen HOME op types — exactly the ARCH §9 HOME list

`set-field` · `add-institution` · `remove-institution` · `set-institution-state` · `add-npc` ·
`remove-npc` · `set-npc-status` · `add-faction` · `remove-faction` · `set-power-holder` ·
`rebalance-power` · `set-relationship` · `rename-faction` · `rename-npc` · `rename-settlement` ·
`set-world-fact` · `found-phantom` · `promote-phantom`

⛔ **`set-state` IS STRUCK** (ruling 2; design §14: system states are DERIVED and are never
editable on any card). Its absence is asserted by name in A1, so a later author cannot restore it
without a red.

**The three new rows' exact payloads:**

| type | target | payload | notes |
|---|---|---|---|
| `set-npc-status` | `npc` | `{ status: { kind: 'enum', values: <the `NpcStatus` SEVEN, post-EM-B1d>, required: true }, cause: { kind: 'pool', pool: 'cause.remove', required: false } }` | ⛔ **The tree's six PLUS the owner's `jailed`** = `active, dead, exiled, jailed, missing, removed, retired` (design §15 as respelled; the typedef edit is **EM-B1d's**, §15 below). The op **CREATES the field** on an NPC that lacks it (measured: it exists today on roughly one NPC in ten, the structural seats, value `active`) and calls the **existing ops-layer writers** — never a second path. ⛔ FINITE-SEMANTICS; `kind: 'free'` is a STOP |
| `set-institution-state` | `institution` | `{ state: { kind: 'enum', values: <the `EntityStatus` SIX, post-EM-B1d>, required: true }, cause: { kind: 'pool', pool: 'cause.remove', required: false } }` | ⛔ **The tree's five PLUS the owner's `ruined`** = `active, destroyed, impaired, removed, ruined, vacant` ("abandoned" is `vacant`; the typedef edit is **EM-B1d's**). ⭐ `destroyed` and `remove-institution` are **different acts** — the record keeps what was destroyed and forgets what was removed (§15), and the tree already spells both |
| `set-world-fact` | `settlement` | `{ fact: { kind: 'enum', values: <the seven world-fact keys>, required: true }, value: { kind: 'pool', pool: '<per fact>', required: true } }` | ⛔ **DECLARATION ONLY.** The seven keys are `terrain, culture, tradeAccess, resources, goods, services, stressors`. **No re-derivation, no pin, no `rederive` call** — the engine is EM-B2's (§14 final) |

### ⛔ `set-power-holder` MOVES THE FLAG; THE NAME FOLLOWS (the chair's contract fact 1)

`powerStructure.governingName` has **two writers** in the tree, plus one propagation site, and the
op writes **none of them directly**:

| # | site | what it is |
|---|---|---|
| W1 | `src/generators/power/rulingStructure.js:787` | **GENERATION.** Derives the name from the roster: `(factions.find(f => f.isGoverning) || {}).faction`. Its own comment is the law — *"it must always name the faction entry that carries `isGoverning`"* |
| W2 | `src/domain/rulingPower.js:657` | **THE TRANSFER OF POWER.** Writes `governingName` and `government` together with `previousGovernments`, `publicLegitimacy` and `stability` |
| P1 | `src/generators/power/economyReconciliation.js:277` | a **propagation**, copying `projected.governingName` — not an independent decision |

⛔ **So `set-power-holder`'s payload names the new holder and the op moves `isGoverning` on the
roster, calling W2's transfer path; it NEVER writes `governingName` or `government` itself.** A
direct write would put the canonical name out of step with the flag that every sim consumer keys
on (the file at W1 lists them: factionProfile legitimacy inheritance, ruling_authority governing
power, hook escalation, the simulation spine, world-event legitimacy deltas). Asserted in A3.

### ⭐ `set-institution-state` WRITES TWO SHAPES BY VALUE (§934.47 add. 6)

The op offers the pool **{active, impaired, ruined, destroyed, vacant}** and writes the shape the
tree already uses for that value — never a new one:

| value | shape written | via |
|---|---|---|
| `active` · `impaired` · `destroyed` · `vacant` | the composer's own constants — `STATUS_ACTIVE` / `STATUS_IMPAIRED` / `STATUS_DESTROYED` / `STATUS_VACANT` from `src/domain/entities/status.js` | the existing entity-status writers |
| **`ruined`** | ⛔ **the PULSE's own shape**, not the composer's | the pulse's ruin path — **on a canonized town** through the tick; **on a draft** directly |

⛔ **`ruined` is NOT a member of `EntityStatus` and this op does not make it one.** It is the
pulse's word, and writing it through the composer's constants would merge two vocabularies the
tree keeps apart on purpose.

⭐⭐ **RULED (ODQ §934.47 add. 7, option a): the `ruined` arm CALLS `ruinInstitution(inst, { reason, fate })`**, the ONE exported writer **EM-B1e** mints on the calamity kernel. The op passes
`fate: 'ruined_by_decree'` and `reason` = the decree's own cause from the removal pool; the pulse's
disaster path passes `'destroyed_by_disaster'` and its own reason. **One shape, one writer, two
callers** — so a DM's ruin and a disaster's leave the same record and the pulse's own history does
not move (EM-B1e's A1 proves it byte-equal). ⛔ This packet **authors no ruin shape of its own**;
a second writer here is a STOP.

⚠⚠ **The three measurements that forced option (a), retained as the record (evidence §6):**

1. **The shape has FIVE keys, not two.** The only live writer of that literal is
   `src/domain/worldPulse/calamityKernel.js:250-252`:
   `{ ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true,
   worldPulseFate: 'destroyed_by_disaster', remnantReason: reason }`.
2. **Two of those keys are CALAMITY-SPECIFIC.** `worldPulseFate: 'destroyed_by_disaster'` would be
   a **lie** on a DM decree — the town was not struck by a disaster — and `remnantReason` takes a
   calamity's reason string.
3. ⛔ **THE RUIN PATH IS NOT EXPORTED.** `ruin` is a module-private arrow function declared inside
   another function body; `calamityKernel.js`'s exports around it are `promotesTo` (`:180`) and
   `strikeCapForTier` (`:196`). **There is no exported symbol for this op to call**, so the ruling's
   *"name the one the op calls, by symbol"* has no answer at this base. **RAISED R4.**

✅ **R4 is CLOSED by the ruling above**: the door is `ruinInstitution`, minted by EM-B1e, and this
packet's `Depends on` carries it.

⛔ **`set-world-fact`'s `value` pool id is resolved per `fact`, and the mapping is DATA in this
row, not logic**: `terrain → worldFact.terrain`, `culture → worldFact.culture`,
`tradeAccess → worldFact.tradeAccess`, `resources → worldFact.resources`,
`goods → worldFact.goods`, `services → worldFact.services`, `stressors → worldFact.stressors`.
⚠ **`worldFact.tradeAccess` is BLOCKED in EM-A2b** (no canonical option list; the wizard's six
disagree with the generator's five). `validateOp` therefore validates `fact` membership and the
PRESENCE of `value`, and does **not** resolve the pool — pool resolution is the dialog's (EM-D2)
and the guard engine's. **The block does not propagate here**, and that is stated so the two
packets are not coupled by accident.

### Absence rules

**absent** `type` / unknown type → `makeOp` returns `null`; `validateOp(null)` returns
`{ ok: false, errors: ['op is absent'] }` (the exact frozen string). **empty** relation array —
legal and meaningful. **`null`** — the `duration` value for "no duration"; forbidden elsewhere in
a row. **invalid legacy input** (an older op shape, a non-object, a string) — rejected by
`validateOp` with a named error; never repaired, never thrown on.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| — | `makeOp(type, target, payload)`, `type` in `OP_TYPES`, `target` well-formed | none (pure) | an `Op` carrying the type's declared `stage`, `consequence` and four relations | none |
| — | `makeOp` with unknown type or malformed target | none | **`null`** | none |
| an `Op` | `validateOp(op, world)` | payload schema + relational integrity | `{ ok: true, errors: [] }` | none |
| an `Op` | `validateOp` on a payload violation | — | `{ ok: false, errors: [<named, sorted>] }` | none |
| institution, any state | `set-institution-state` with `active\|impaired\|destroyed\|vacant` | pool membership | the record carries the composer's `STATUS_*` value | the op's own |
| institution, any state | `set-institution-state` with **`ruined`** | pool membership | **`ruinInstitution(inst, { reason: <the decree's cause>, fate: 'ruined_by_decree' })`** — EM-B1e's one exported writer; at the tick on canon, directly on a draft | the op's own |

⚠ **`validateOp` NEVER refuses an action** — it reports. `ok: false` means "malformed", not
"disallowed". Refusal is not this packet's to invent, and the guards never refuse either
(design §2.7; §P8).

### The declared relations

`requires[]` — types (or, for **home** ops, world predicates) that must precede this one.
`enables[]` — the types this one makes available. `relatedTo[]` — types the catalogue marks as
belonging together, which lets the connection guard OFFER a follows-from link (§2.7a) without
inventing anything. `conflictsWith[]` — types whose co-presence raises the `contradiction` guard.

⛔ **RELATIONAL INTEGRITY IS TOTAL AND SYMMETRIC WHERE IT MUST BE.** Every string in every relation
array is a key of `OP_TYPES` (A4). `conflictsWith` is **symmetric**; `requires`/`enables` are
**exact inverses**; `relatedTo` is **symmetric**. These are assertions, not conventions, because a
one-sided relation makes a guard fire for one ordering and not the other.

⚠ **B1b APPENDS TYPES, SO A4's INTEGRITY ARM MUST NOT ASSUME CLOSURE OVER B1a ALONE.** At this
packet's tip the eighteen are closed over themselves — **no home row names an off-stage type** —
and A4 asserts exactly that. B1b re-runs the same arm over all twenty-five.

### Ordering and precedence

Pipeline position **NONE** — a pure leaf, outside generation and outside the pulse. **Stable
enumeration:** `Object.keys(OP_TYPES)` is authored and asserted in `compareCodepoint` order, so a
new row cannot be appended "wherever"; `validateOp`'s `errors` are `compareCodepoint`-sorted.
**Merge/deduplicate:** not applicable — this packet holds no collection of ops.

### Determinism

- **Hash/fork key:** `NONE`. ⛔ This packet draws no random number. `makeOp` **mints no id** — the
  entry id is EM-C1's `stage()`, the DM entity id is EM-B2's `mintDmId`. A PRNG import is a STOP.
- **Stable enumeration:** as above. **Rounding/clamping:** none; no float produced or rendered.
- **No-draw behaviour:** the leaf imports nothing from `src/kernel/prng.js` or
  `src/kernel/rngContext.js`, so it cannot move any stream. A6 asserts the import list.

### Flag and dormancy

**Flag:** `NONE` — headless; `TIER_GATE.premium.editMode` is EM-D1's. **Dormancy:** zero importers
at this tip. **Golden posture:** `UNCHANGED` — `generatorGoldenMaster` and `dossierProseManifest`
must not move by one byte; structurally guaranteed. **Motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Frozen module constant | pure reads | **Never** — an `Op` is persisted only inside a `Decree`, EM-B3's key and EM-B3's door | n/a | n/a | n/a | **None owed here**; an op-shape change after EM-B3 is EM-B4's migration | **None** — no secret read |

### Receipts and privacy

`NONE` — `validateOp` returns a typed result, not a receipt. No DM-only field, no projection;
those are EM-B3's (§P2.6).

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: the op catalogue is a vocabulary of acts; it reads no alignment,
  law or temper axis and ranks nothing.`
- **Edit story:** `ENGINE-ONLY: the DM's verbs arrive here from EM-D2's dialog through EM-C4's
  single adapter. This packet is the vocabulary beneath them.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/operations.js` | `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `OP_TYPES`, `makeOp`, `validateOp` | **250 eff (cap); ≈231–249 estimated** | The vocabulary of §6 with exactly the eighteen HOME rows, every row carrying all ten fields. Both closed vocabularies carry BOTH members. Import no PRNG, no `src/store/**`, no `src/components/**`. Author `consequenceFor` nowhere; call `rederive` nowhere. Leave the structure open for B1b to append. |
| `CREATE` | `tests/domain/editOperations.test.js` | A1–A8 | `n/a` | ONE literal `describe`, **eight straight-line `it`**, no `.each`/`runIf`/nesting (§P3.4). Table arms report a FULL offender list. Negatives carry `// anchored:` on the line immediately above. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the tuple | `n/a` | ⛔ **DEFERRED TO THE TERMINAL** — no edit. |

Generated artifacts: `NONE`. ⛔ **Edge-shared closure NOT owed** — zero existing files modified.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — `+1 file`, INTERIOR RED** | `files` is `TEST_FILES.length` over `tests/**/*.test.js` (`:515`, `:612`) — the driver is the new TEST file, **not** the `src/domain` leaf (ruling 8 accepts this). From `2645/383/2262/25009/6670`: `+1/+0/+1/+8/+1`. Re-derived whole at the terminal (§P3.2). |
| P2.2 | mutation-coverage row | **NOT OWED — it moved to EM-B1b with the walker** | `tests/lint` is the first ENFORCER DIR (`mutationCoverage.shared.mjs:36-37`); this packet adds no `tests/lint/` file. ⭐ The split moved the obligation cleanly with the file that incurs it. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key read; nothing persisted. Scanner covers every `.js` under `src/` (`:250`); the check is in `checks`. |
| P2.4 | writer-reach | **CANNOT MOVE** | `SURFACE_CLOSURE_STOP` includes `'src/store/'` (`writer-reach-scan.mjs:115-117`). |
| P2.5 | decision-fork + mechanism-coverage | **NOT OWED** | This packet mints no seeded chooser and no pool; it draws nothing at all. |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |

> ⛔ **THE CENSUS ROW IS DEFERRED (§417 / MF-T2Q shape)** — DRAFT reserves as READY does, so no
> edit is made and `EM-B1a.manifest.json` **omits** the path. The chair inserts it once, at the
> terminal:
>
> ```json
>         { "action": "TEST", "path": "tests/lint/sovereigntyLightingContract.walker.test.js" }
> ```
>
> ⚠ **INTERIOR RED, NAMED IN ADVANCE:** `the estate's file count moved — re-measure, do not
> re-word: expected 2646 to be 2645`.

---

## 8. Ordered coding sequence

0. Dispatch and seal; re-read `git rev-parse HEAD` in the same command.
1. Capture the baseline: the census figures; `sha256` of
   `tests/fixtures/generator-golden-master.json` before any edit.
2. Add `tests/domain/editOperations.test.js` with A1–A8 **failing**.
3. Implement the pure data contract: `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, the payload-spec
   vocabulary, then the eighteen `OP_TYPES` rows.
4. Implement `makeOp`, then `validateOp`.
5. Extend the sole writer / wire consumers: **NOT APPLICABLE** — no writer, no consumer, lands
   DARK. Record both steps as skipped.
6. Registrations: none owed (§7). The prevention guard is A4's relational-integrity arm.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan; write the completion receipt.

```text
validateOp:
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

`tests/domain/editOperations.test.js`, one literal `describe`, eight straight-line `it`.

| ID | Case | Required observation |
|---|---|---|
| **A1** | **Main + GUARD-THE-GUARD, first** | `OP_TYPES` holds exactly the **eighteen** HOME types of §6, set-equal both directions with a full offender list. **Every row carries all ten fields**, each of the declared type, `guardsStated` non-empty. `Object.keys(OP_TYPES)` is in `compareCodepoint` order. ⛔ **`set-state` is asserted ABSENT by name** (ruling 2; design §14: system states are derived), so restoring it reds. `makeOp('set-field', {kind:'institution',id:'i1'}, {...})` returns an `Op` carrying the declared `stage`, `consequence` and relations. |
| **A2** | **Absence and malformed input — nothing throws** | Unknown type, `null` target, `{kind:'nonsense'}`, a string op, `undefined`, an undeclared payload key: `makeOp` returns **`null`** for each; `validateOp` returns `{ok:false, errors:[…]}` with the NAMED error and never throws. `validateOp(null)` returns exactly `errors: ['op is absent']`. An omitted required field names that field; an enum value outside `spec.values` names that field. |
| **A3** | **⛔ THE STAGE PARTITION SET-EQUAL, AND THE SEAT'S FLAG** | ⭐ `set-power-holder`'s payload names a HOLDER and its declared writer is `rulingPower.js`'s transfer path; a source scan proves this module writes neither `governingName` nor `government` (matcher proved live on a planted string) — the name follows the `isGoverning` flag, as `rulingStructure.js:787`'s own comment requires. Then: `OP_STAGES` is exactly `['home','off-stage']` and `OP_CONSEQUENCE_POLICIES` exactly `['home','by-target-reality']`, both frozen. **Every one of the eighteen rows is `stage:'home'` AND `consequence:'home'`**, and the two sets are asserted **SET-EQUAL to each other** so the fields can never drift apart. ⭐ The off-stage members are declared but provably **unreached at this tip** — asserted as an empty selection — which is what lets B1b append without editing a frozen constant. Counterforce: a source scan proves `consequenceFor` is defined **nowhere** in this module (it is EM-F1's), and `rederive` is called nowhere (it is EM-B2's). |
| **A4** | **⛔ RELATIONAL INTEGRITY, TOTAL AND CLOSED (the prevention guard)** | Every string in every `requires`/`enables`/`relatedTo`/`conflictsWith` is a key of `OP_TYPES` (full offender list). `conflictsWith` is symmetric both directions; `requires`/`enables` are exact inverses; `relatedTo` is symmetric. ⭐ **No home row names an off-stage type** — the eighteen are closed over themselves at this tip, asserted by name, which is the arm B1b re-runs over all twenty-five. |
| **A5** | **Boundary — the rename ops delegate and re-implement nothing** | Each of the three `rename-*` types declares the right target kind, a single required name field, `stage:'home'`, `consequence:'home'`, and names the existing cascade as its declared writer. A source scan proves this module defines **no rename logic of its own** and re-implements no path in `FACTION_RENAME_SURFACES` — the join-key law honoured by delegation (HZ-JOINKEY) — with the matcher proved live on a planted string. |
| **A6** | **Purity, dormancy and the import fence** | `makeOp` / `validateOp` are proved pure: identical inputs give `toEqual` results, the input `payload` is proved unmutated against a pre-call clone, and 100 calls change nothing observable. The import list is asserted EXACTLY and contains **none of** `src/kernel/prng.js`, `src/kernel/rngContext.js`, any `src/store/**`, any `src/components/**`, and **no force/muster/casualty/upkeep module**. A scan over `src/**` finds **zero importers**, with guard-the-guard arms on the walk and the matcher. |
| **A7** | **⛔ THE TWO VOCABULARIES ARE THE TREE'S, AND THE FIELD IS `category`** | `set-npc-status.payload.status` is `kind:'enum'` with exactly the `NpcStatus` six (`active, dead, exiled, missing, removed, retired`) and `set-institution-state.payload.state` exactly the `EntityStatus` five (`active, destroyed, impaired, removed, vacant`) — **each parsed from its own typedef's source file by the test**, so a typedef edit reds here; neither is `kind:'free'`. `jailed` is asserted **ABSENT by name**. ⭐ **`set-field` and `add-faction` spell `category`, never `archetype` or `type`** — asserted by a source scan finding no `archetype`/`type` payload key, because `archetype` is a DERIVATION (`factionArchetype(f)` from `f.category`) and design §14 forbids editing one. And `set-institution-state('destroyed')` and `remove-institution` are asserted DISTINCT op types. |
| **A8** | **The `ok`/`errors` invariant, and `set-world-fact` as a DECLARATION** | For every case in a table of valid and invalid ops, `result.ok === (result.errors.length === 0)`. `errors` is FROZEN and `compareCodepoint`-sorted (a three-error case asserted in exact sorted order). ⭐ `set-world-fact` validates `fact` membership against the **seven** world-fact keys and the PRESENCE of `value`, and is asserted **not to resolve any pool and not to re-derive anything** — proved by a source scan finding no `rederive` and no pool import, so the §14 engine stays EM-B2's. |

**8 of ≤8.**

---

## 10. Verification commands

```sh
npx eslint src/domain/edit/operations.js tests/domain/editOperations.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict          # src/domain/edit/** must be strict-clean (§P4)

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editOperations.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B1a
npm run implementation:resume -- EM-B1a
```

⚠ The rename cascade's own suite should be re-run unchanged; **this lane did not measure its
path** and names none — the implementer resolves it at preflight (`ls tests/domain | grep -i
rename`) and records it. An unmeasured path is not a verified fact.

Expected: every command exits `0`, **except** the named census interior red until the terminal.
⛔ Never read a gate through a shell pipe (§P7). A member never runs `npm run check`.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: the seal is missing or foreign; **HEAD is
not `d31af2cee` or a descendant proved non-interfering by execution**; **`operations.js` measures
> 250 effective lines** under eslint's own `Linter` with `skipBlankLines` and `skipComments` →
take the pre-declared **EM-B1c** (the three `rename-*` ops + `set-world-fact`), **never squeeze**;
**`rederive`, a pin, or any re-derivation appears necessary** (that is EM-B2's — HZ-DERIVED);
`consequenceFor` would need authoring, importing or referencing (EM-F1's); **any phantom-side
world state appears necessary**; **a second force-return mechanism appears necessary**; an adapter
per op type appears necessary (§12.13); a PRNG or `rngContext` import appears necessary; a golden
or the prose manifest moves by one byte; a §15 vocabulary would have to be typed `free` rather
than `enum`; `set-state` would have to be restored; `renormalizeFactionPower` is found to be pure
(it is not — it mutates in place); `applyFactionRenameToSettlement`'s return shape has changed.

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas
(`operations.js` measured with eslint's `Linter`) · acceptance A1–A8 executed · the mutants planted,
convicted and restored digest-exact (§P6) · focused commands, exits and counts · sealed per-step
receipt and resume status · both typecheck configurations · gate stages actually executed ·
base-versus-wave failure identity diff · dormancy/golden result (fixture digest before and at the
tip) · census tuple before and at the tip with the interior red quoted verbatim · generated
artifacts `NONE` · deviations `NONE | STOP` · out-of-scope observations without investigation ·
**judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | **The ≈231–249 estimate leaves ≤19 lines of margin** against the 250 cap at eighteen rows. **EM-B1c** (the three `rename-*` ops + `set-world-fact`, ≈36 effective) is pre-declared at §3 as the next split, on the principled line *rows that delegate to another packet's machinery*. Ratify the contingency, or direct a different line now. |
| **R2** | **`set-world-fact` names `worldFact.tradeAccess` among its seven `fact` values, and that POOL is BLOCKED in EM-A2b** (no canonical option list; the wizard's six disagree with the generator's five). This packet is **not** blocked by it — `validateOp` checks `fact` membership and `value` presence and resolves no pool — but the chair should know the two packets touch the same gap from opposite sides. |
| **R3** | **The rename cascade's test path was not measured by this lane** and is named nowhere; §10 directs the implementer to resolve it at preflight. |


---

## 14. REVISION 2 — the chair's three contract facts (§934.47 addendum 2), each measured

**(1) `set-power-holder` moves `isGoverning`; the name follows.** Confirmed, and the two writers
plus one propagation site are named in §6 and §5. The op's writer is `src/domain/rulingPower.js`'s
transfer path. A3 carries it.

**(2) The archetype-like field is `category`.** Confirmed: the faction pushes carry
`faction`/`power`/`desc`/`isGoverning`, `category` is read live at three sites, and
`factionArchetype(f)` DERIVES the archetype from it. `set-field` and `add-faction` spell
`category`; `archetype` and `stance` are dropped (the pool follows in EM-A2a). A7 carries it.

**(3) `set-npc-status` CREATES the field and calls the existing writers.** Confirmed, with one
refinement the tree forces: the canonical vocabulary is `NpcStatus` = **six**
(`active, dead, exiled, missing, removed, retired`) — the chair's list of seven includes `jailed`,
which the typedef does not carry. The packet spells the tree's six, because the same fact rules
the existing writers are the op's writer and a value outside their typedef would break them.
**`jailed` is RAISED (R4), never invented.**

No acceptance case was added: the three facts fold into A3 and A7. **Cases remain 8 of ≤8.**


---

## 15. ⛔⛔ THE VOCABULARY GROWTH — STOP AND SPLIT INTO EM-B1d (the chair's ruling 1, §934.47 add. 3)

**The order.** `NpcStatus` gains `jailed` → **{active, exiled, jailed, dead, missing, retired,
removed}**; `EntityStatus` gains `ruined` → **{active, impaired, ruined, destroyed, vacant,
removed}** ("present" is `active`, "departed" is `retired`, "abandoned" is `vacant` — design §15 as
respelled on the ledger at `5985cce7a`). Both typedef edits were to ride in this packet **unless
their consumer rows take it past three existing logic files.**

⛔ **THEY DO — by a factor of three, measured. The vocabulary growth SPLITS into `EM-B1d`.**

### The enumerating-consumer roster, measured by grepping each member

| # | file | what it enumerates | `jailed` / `ruined` verdict |
|---|---|---|---|
| 1 | `src/domain/entities/npcs.js` | the `NpcStatus` typedef itself (`:30`) | **+`jailed`** |
| 2 | `src/domain/entities/status.js` | the `EntityStatus` typedef (`:23`) **and its five `STATUS_*` constants** (`:88-92`) | **+`ruined`** + a sixth constant |
| 3 | `src/domain/density/factionLifecycle.js:75` | `ROSTER_ABSENT_STATUSES = ['dead','exiled','removed']` | a jailed NPC is off the roster — **decision** |
| 4 | `src/domain/entities/successors.js:63` | `n.status !== 'dead' && !== 'removed' && !== 'exiled'` | design §15: *"a jailed or exiled holder cannot keep a seat"* — **must add** |
| 5 | `src/domain/worldPulse/envoyCasting.js:98` | `['dead','killed','missing','exiled','imprisoned']` | ⛔ **see the synonym finding below** |
| 6 | `src/domain/worldPulse/magicFormsPractitioner.js:79` | `LOST_NPC_STATUS = new Set([...5])` | **decision** |
| 7 | `src/domain/events/affordanceManifest.js:197` | `status === 'impaired' \|\| 'removed' \|\| 'destroyed'` | **+`ruined`?** |
| 8 | `src/domain/events/targetRosters.js:103` | the same triple | **+`ruined`?** |
| 9 | `src/components/new/SummaryTab.jsx:56` | a status → colour/label map carrying `vacant` | **+`ruined`** for the badge |

**Two typedef files + seven enumerating consumers = NINE existing logic-bearing files against a
cap of THREE.** `PACKET_STANDARD.md` is explicit — *"If the work cannot fit, the agent stops and
proposes the smallest split"* — and this packet already carries eighteen op rows at ≈231–249 of
250, so the growth cannot ride here in any form.

### EM-B1d — the proposed member

**One behaviour family:** *two typed unions gain one member each, and every enumerating consumer
is re-judged.* CREATE nothing; MODIFY the two typedef files plus the seven consumers as the
chair's rulings direct; TEST a union-totality walker that asserts each union's members set-equal
to a live scan of its enumerators, so a tenth consumer landing later cannot silently under-enumerate.
⚠ **Nine modified files exceeds the default budget too**, so EM-B1d itself opens with either an
approved override or a two-member split along the union line (`B1d-N` for `NpcStatus`'s four
consumers, `B1d-E` for `EntityStatus`'s three plus the badge). **The chair rules; this lane does
not raise a budget.**

### Two findings the roster turned up, neither investigated

⛔ **F-V1 — `imprisoned` ALREADY EXISTS AS A FOREIGN SPELLING OF THE OWNER'S NEW WORD.**
`envoyCasting.js:98` tests `['dead','killed','missing','exiled','imprisoned']` — and **neither
`killed` nor `imprisoned` is a `NpcStatus` member**. Adding `jailed` to the typedef while that
arm reads `imprisoned` ships **two spellings of one idea**, which is the writer/reader
spelling-drift class this estate has been bitten by twice. EM-B1d must rule: `jailed` replaces
`imprisoned` there, or the arm tests both. **RAISED R5.**

⛔ **F-V2 — A HOT FILE SITS ONE STEP BEHIND THE BADGE ROW.**
`src/components/new/tabs/EconomicsTab.jsx` is on the standing hot list at **600 effective against
a 600 ceiling — ZERO headroom** (`PACKET_STANDARD.md`), and it enumerates `'impaired'` and
`'vulnerable'` status values beside `SummaryTab.jsx`'s map. It is **not** in the roster above
(its enumeration is over supply-chain status, a different union), but any lane extending the
status badges must measure it before touching it. Named so it is not discovered by a `max-lines`
red. **Recorded, not investigated.**

### What this packet does instead

**EM-B1a's change manifest is UNCHANGED: zero existing production files modified.** Its
`set-npc-status` and `set-institution-state` rows spell the **post-EM-B1d** vocabularies — the
seven and the six — and `EM-B1d` is named in `Depends on` so it lands first. A7 keeps parsing both
vocabularies from their typedef source files, so if B1d has not landed the arm reds honestly
rather than passing on a stale six. **RAISED R6** if the chair prefers B1a to ship the tree's
current 6/5 and B1d to update the op rows afterwards.

| **R4** | ✅ **CLOSED (§934.47 add. 7, option a): EM-B1e mints `ruinInstitution` and this packet's `ruined` arm calls it.** The measurement that forced it, retained: ⛔ **the pulse's ruin path had no exported symbol, AND ITS SHAPE IS CALAMITY-SPECIFIC.** Ruling (1) asks this packet to name, by symbol, the ruin path `set-institution-state` calls. Measured: the only live writer of `status: 'ruined'` is a **module-private arrow** (`const ruin = (inst, reason) => ({...})`) inside a function body in `calamityKernel.js:250`; the neighbouring exports are `promotesTo` (`:180`) and `strikeCapForTier` (`:196`). Its shape carries **five** keys, two of them calamity-only — `worldPulseFate: 'destroyed_by_disaster'` would be a lie on a DM decree. **Three ways forward:** **(a)** export a shared `ruinInstitution(inst, { reason, fate })` from the pulse and have both callers use it — a production MODIFY of a pulse file, its own small member; **(b)** the op writes the two non-calamity keys itself (`status: 'ruined'`, `_worldPulseInactive: true`) and names no path — cheapest, but it mints a second writer of the pulse's shape, which is the thing the ruling is avoiding; **(c)** `ruined` leaves the editor's pool until (a) exists. The op's `ruined` arm is specified by VALUE below; **the door is the chair's to name.** |
| **R5** | **EM-B1d's file count** — five existing logic files against a default cap of three, after the override lapsed. Reported there, not absorbed; one reading makes it four (the typedef edit is a comment and changes zero effective lines). |

---

## 16. ⛔ THE TWO-KIND `requires` (ODQ §934.50, design §18) — and its two structural consequences

**The order.** `requires` splits: `requires: { world: [...], registry: [...] }`. The **world** half
is named pure predicates over the record and the campaign that decide **whether a card offers the
seal at all** — *"not a guard refusing an act but the world's state determining which acts exist"*
(design §18). The **registry** half is the existing entry-ordering condition the guards judge,
suggestive as ruled.

### 16.1 · The predicate roster — each measured, by symbol

| predicate | the field/reader that answers it | verdict |
|---|---|---|
| `warInProgress(counterparty)` | **`atWarWith(graph, worldState, a, b)`** — `src/domain/roads/embassyHazard.js:74` (`atOpenWar(...) \|\| relationshipTypeBetween(...) === 'hostile'`); the indexed twin is `atWarWithIdx` (`worldPulse/tickIndices.js:413`) | ✅ **LIVE** |
| `forceInField` | **`worldState.deployments[settlementId]`** — read at `briefs/composers.js:118` and `applyWorldPulse.js:409` (`!(state.deployments && state.deployments[besieger])`). ⚠ A FIELD, with no exported predicate — the leaf writes the reader | ✅ **LIVE** |
| `siegeInProgress` | **`liveSieges({ worldState, regionalGraph })`** — `src/domain/display/warStatus.js:88`, *"codepoint-sorted by targetId; empty when no sieges are live"* | ✅ **LIVE** |
| `tradeWith(partner)` | **`worldState.relationshipStates[edge].relationshipType === 'trade_partner'`** — the vocabulary is `PRIMARY_RELATIONSHIP_TYPES` (`worldPulse/relationshipCompatibility.js:41`) | ✅ **LIVE** |
| `beliefExists` | **`hasBeliefMaps(worldState)`** — `src/domain/display/settlementBeliefs.js:188`, over `spatialLedgers.beliefMaps` | ✅ **LIVE** |
| `npcPresent` | **`NpcStatus === 'active'`** — EM-B1d's union | ✅ **LIVE** |
| `pendingPeaceOffer(counterparty)` | ⚠ **`isBilateralPeaceOffer(outcome)`** (`warPeaceDecision.js:61`) reads an OUTCOME in flight — `proposalPayload.peaceOffer === true`. There is **no standing "an offer is pending" field** on the record | ⛔ **`source: 'EM-E4'`** |
| `envoyArrived` | ⚠ the army-transit layer projects envoy encounters (`projectArmiesForEnvoyEncounters`, `armyTransitKernel.js:510`) but carries **no "an envoy has arrived at us" standing field** | ⛔ **`source: 'EM-E4'`** |
| `openRoute` | ⛔ the tree states the absence itself: *"the estate has no PROPER-shaped route name anywhere on a settlement (`economicState.tradeRoutes` does not exist; `tradeAccess` is the common noun `road` / `port` / `isolated`)"* — `defenseStateProse.js:1498` | ⛔ **`source: 'EM-E4'`** |
| `plotInMotion` | ⛔ `collectPlotHooks` (`dossier/plotHooks.js:209`) yields **narrative plot HOOKS for the dossier**, not a coup-plot state. No plot-in-motion record exists | ⛔ **`source: 'EM-E4'`** |

⇒ **six live, four honestly absent.** The four are **declared with `source: 'EM-E4'` and not
invented** — the pins packet lands the state, exactly as the ruling directs.

### 16.2 · ⛔ CONSEQUENCE ONE — the predicates need their own leaf, measured

The chair allowed a sibling *"if the leaf cap demands — measure"*. **It demands:** `operations.js`
already estimates **≈231–249 of 250**, and ten predicates with their field reads are ~60 effective
lines. They go to **`src/domain/edit/worldConditions.js`** — which makes this packet's *new
logic-bearing leaves* **2 of ≤2**, at the cap exactly.

⛔ The leaf exports `WORLD_CONDITIONS` (the frozen id → predicate map) and nothing else; each
predicate is `(record, campaignState) => boolean`, **pure, total, and false-on-absence** — an
absent field yields `false`, never a throw, so a card simply does not offer the seal. The four
`source: 'EM-E4'` rows are present in the map, **return `false` until their state exists**, and
carry their source note as data so the walker can tell a declared-absent predicate from a missing
one.

### 16.3 · ⛔ CONSEQUENCE TWO — the row-shape change forces EM-B1c, which was pre-declared

`requires: []` becomes `requires: { world: [...], registry: [...] }` on **every one of the
eighteen rows**. At ~+1 effective line per row that is **+18**, taking `operations.js` from
≈231–249 to **≈249–267 against the 250 cap**.

⇒ **the EM-B1c split pre-declared at §3 is no longer a contingency — it is REQUIRED.** Its line
was already chosen and is unchanged: the three `rename-*` ops plus `set-world-fact` (four rows,
≈36 effective) leave, taking B1a to **≈213–231**. ⛔ The lane does not squeeze the rows to avoid
it. **RAISED R6.**

### 16.4 · The acceptance stays at 8

The world half folds into **A2** (validation) and **A4** (relations), as the ruling directs: a
predicate that is **false ⇒ the op is not offered**, and a **planted true ⇒ offered** — both
asserted inside the existing cases, with the four `source: 'EM-E4'` predicates asserted to return
`false` **and** to carry their source note, so a declared absence is never mistaken for a bug.
**No case is added.**

| **R6** | ✅ **CLOSED — EM-B1c RATIFIED (§934.47 add. 10)** on the pre-declared line plus `schedule-event`. B1a keeps **fourteen** home ops and re-measures at **≈213–227 of 250** ✅. The original finding, retained: **the `requires` shape change forced it.** `{ world, registry }` costs ~+1 effective line on each of eighteen rows, taking `operations.js` to **≈249–267 against 250**. The split's line was already chosen at §3 — the three `rename-*` ops plus `set-world-fact` — and taking it leaves B1a at ≈213–231. **The lane does not squeeze rows to avoid a split the chair already pre-declared.** Ratify EM-B1c now, or direct a different line. |
| **R7** | ✅ **CLOSED — `schedule-event` rides with EM-B1c** as the nineteenth home op. The finding, retained: **it is a HOME op** (design §18: *"always … `when` at or after the next tick"*), so it lands in this packet's set rather than EM-B1b's. It arrives at the same moment the cap is already exceeded — so it rides with EM-B1c, or B1a sheds one more row. Chair's call. |
