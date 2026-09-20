# Settlement editor / EM-A2a — the pool machinery and the ten TABLE pools: one seeded roller on its own stream, and every closed vocabulary read at its source

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠ The base has moved **ten commits** under this lane during compile (11:01→11:33 EDT), every
  one of them docs plus two unrelated files. `d31af2cee` **IS an ancestor** of `7aa769830`, and
  **every path this packet measures is blob-identical across the whole window** (evidence §0).
  Held at `d31af2cee` per the chair's ruling (6): *the chair re-pins every packet to one tip at
  promotion.*
- **Last revalidated:** 2026-09-19 11:33 EDT, `d31af2cee` (descendant `7aa769830` proved
  non-interfering by blob comparison)
- **Depends on:** `EM-A1` (declarations — a `pool` field names a pool id; the declaration walker
  asserts membership of `POOLS`). Name-only: this packet imports nothing from EM-A1.
- **Collision group:** `EM-A2b`, which **appends pool rows to this packet's `POOLS` and imports
  its machinery**. A2a lands FIRST; A2b's own arms re-assert A2a's totality so a dropped row reds.
  Measured: all 182 registered packets are TERMINAL, so nothing in the manifest reserves any path.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: `getInstitutionsForTier('town')` → a
  `Set` of 85; `getInstitutionalCatalog('town')` → 10 categories / 85 rows; `FACTION_ARCHETYPES`
  13 (the `category` pool's values); `NpcStatus` 6 and `EntityStatus` 5 (the TREE's typedefs);
  `RESOURCE_DATA` 33 + `SPECIAL_RESOURCES` 6; `TIER_ORDER` 6;
  `TERRAIN_WEIGHTS` 7 keys **proved set-equal to the wizard's own seven**; `CULTURES` 11;
  `STRESS_TYPE_MAP` 15. Census tuple `2645 / 383 / 2262 / 25009 / 6670`. No test was run.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
  ⓘ Per the chair's ruling (6) this lane does **not** stamp it: the hash has moved with each
  ruling (`481dab28…` → `398e562b…` → the current value) and the chair stamps at promotion.

---

## 1. Reconciled authority

1. **THE CHAIR'S RULINGS, 2026-09-19** (ODQ §934.36 addendum, §934.46), carried with no
   discretion: **(3)** `rollFrom(poolId, world, seed, entryId, n)` is the signature, its stream key
   spelled once here, consuming no world draw; **(4)** names take the `instantNpc` shape — a root-composed PRNG with the culture bag passed in;
   **(5)** the pools gain the world-facts pools and the two §15 state vocabularies, re-counted
   against the leaf cap with the pre-declared A2a/A2b split used if over — **it measures over, and
   this packet is A2a**; **(6)** the base stays `d31af2cee`; **(8)** the lighting census counts
   test files, so a `src/` leaf moves nothing — this lane's measurement stands.
2. **ODQ §934.46 / design §15** — NPC `status` and institution `state` are typed roots from a
   pool, **FINITE-SEMANTICS, never free text**; destruction is a state the record keeps, removal
   is erasure.
3. **ODQ §934.45 / design §14 FINAL** — world facts are edited on a fifth card "whose pools are
   the wizard's own option sets", and a change never re-rolls.
4. **THE PROMISE** and the **deity doctrine** (the deity pool is A2b's and reads the world).
5. **design §12.7 GOVERNS** — pools read the GENERATOR's catalogue, never the display seams.
6. **`EM-PREAMBLE.md`** §P2–§P5 (HZ-PRNG in particular), §P8 — cited by hash, not restated.
7. **ARCH §1** (`POOLS`, `poolValues`, `rollFrom`), §2 (`PoolSource`), §9 (the pool list).
8. Live code at `d31af2cee`.

**Resolved contradictions:**

- ARCH §1's `rollFrom(poolId, world, seed, rollIndex)` cannot express a key containing `entryId`.
  **The chair's ruling (3) settles it**: `rollFrom(poolId, world, seed, entryId, n)`. Closed.
- **ARCH §9's `Pools:` line still lists NINE pools** and names none of the world-facts or §15
  pools, while design §14/§15 and the chair's ruling (5) require them. Measured at `7aa769830`:
  the ARCH's op list was amended by §934.46 but **its pool line was not**. The rulings govern; the
  ARCH's pool line lags. **RAISED R1 (a documentation correction, not a build question).**

---

## 2. Outcome

**Observable result:** `src/domain/edit/pools.js` exists with its machinery and its ten
TABLE-backed pools: for any pool id and any world it answers the exact closed value list, drawn
from the engine's own vocabulary at its source, and `rollFrom` picks one deterministically from a
stream that is a pure function of the settlement seed, the entry id and the roll index.

**Definition of done:** `POOLS` holds exactly the ten ids of §6; `poolValues` returns a frozen,
codepoint-sorted, duplicate-free `string[]` (never `null`, never a throw); `rollFrom` returns a
member or `null`; the acceptance proves determinism, the tier gate, the no-draw law, the
wizard-parity of the two world-fact vocabularies and the two state vocabularies. Lands DARK.

In scope: (1) the machinery (`POOLS`, `poolValues`, `rollFrom`); (2) no integration — headless;
(3) the SOURCE-IDENTITY arm, which asserts every table pool equals its source's live answer so a
forked copy reds.

Explicit non-goals: **EM-A2b's seven world-derived pools** (names, `npc.role`, `deity`,
`worldFact.resources|goods|services`) and its `worldFact.tradeAccess` row (EM-P3's mint); EM-A1's
declarations; EM-A3's census; any op, guard, registry entry or persisted key; the `rederive`
engine (EM-B2); any golden, tuning or migration.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | `1` | ≤2 |
| Existing logic-bearing production files modified | `0` | ≤3 |
| Handwritten files total | `2` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≈143 (estimate)** | ≤400 |
| Effective lines per new leaf | **≈143 of 250 (estimate)** | ≤250 |
| Delta in a shared/hot file | `0` — names no hot file | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE`. **HOT FILES: none named.**

⭐ **WHY THE SPLIT WAS TAKEN, arithmetically.** The chair's ruling (5) adds nine pools to the ten this lane
first compiled, and the chair's contract facts then dropped `stance` — eighteen in all. At the measured ~7 effective lines per table row and
~11 per world-derived row, plus ~70 of machinery, a single leaf estimates **≈245–265** with no
margin, and the estate's hot-file lesson is that an estimate in the dangerous direction authorizes
a bad edit. The pre-declared **A2a / A2b** line — *table pools vs world-derived pools* — is taken
exactly as written, and the nine new pools distribute along it naturally: terrain, culture and
stressors are frozen tables (A2a); resources, goods and services read a route, a terrain or a
roster (A2b).

Decomposition of the ≈143: ten `POOLS` rows ≈ 40; six reader/normalizer helpers ≈ 26;
`poolValues` ≈ 20; `rollFrom` ≈ 18; freeze/absence helpers ≈ 15; the five frozen literal
vocabularies ≈ 17; imports ≈ 7. **An ESTIMATE, re-measured with eslint's own `Linter` at
implementation; crossing 250 is a STOP (§11), never a squeeze.**

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-A2a
```

Expected: capsule emitted; ancestry and substrate proven; **CREATE targets ABSENT**
(`src/domain/edit/pools.js`, `tests/domain/editPools.test.js` — measured absent); no non-CREATE
production target; every `requiredSymbols` row resolving.

⚠ **THE WORKTREE IS SHARED AND THE BASE HAS MOVED TEN TIMES DURING COMPILE.** Re-read
`git rev-parse HEAD` in the same command as the dispatch; a descendant is admissible only on the
measured docs-only clause with blob-identity, never assumed.

---

## 5. Verified tree contract

Every row found BY SYMBOL at `d31af2cee`; the proving command for each is in `EM-A2a.evidence.md`.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Tier-gated catalogue | `src/generators/lookups.js` | `getInstitutionsForTier` | Returns a **`Set`** (executed: `'town'` → size **85**); metropolis reads `['city','metropolis']`; every row passes the `minTier` gate | The only source of `institution.class`. Spread it; never mutate it |
| Catalogue shape | `src/generators/lookups.js` | `getInstitutionalCatalog` | `Record<category, Record<name, CatalogRow>>`; executed at `'town'`: **10** categories / **85** rows, name-for-name equal to the Set | The source when the CATEGORY grouping is needed |
| The gate | `src/generators/lookups.js` | `institutionAvailableAtTier` | `(def, tier) => !def?.minTier \|\| tierAtLeast(tier, def.minTier)` | Reuse; never a second gate |
| ⛔ FORBIDDEN seam | `src/domain/display/resourceDisplayName.js` | `resourceDisplayName` | A relabeling map that **passes unknowns through** (`:130`) | ⛔ Never a pool source (§12.7). Same for `institutionDisplayName` |
| PRNG kernel | `src/kernel/prng.js` | `createPRNG` | `pick(arr)` returns **`undefined`** on an empty/absent array (`:33-36`) | The only stream source. ⚠ NOT at `src/generators/kernel/prng.js` — that path does not exist |
| ⛔ Fork-label law | `src/kernel/prng.js` | `fork` | `fork(label) => createPRNG(\`${seed}::${label}\`)`; `tests/kernel/prngForkLabelDelimiter.test.js` freezes the embedded-delimiter families and RESERVES the head `epoch` | ⛔ `rollFrom` calls `fork` never and spells no `::` |
| ⛔ AMBIENT RNG — avoid | `src/kernel/rngContext.js` | `random`, `_roll` | Module-level `_activeRng`; **throws** with none active (`:70-80`), **consumes a world draw** with one | ⛔ Imported nowhere here (HZ-PRNG) |
| Roll precedent | `src/domain/npc/npcOps.js` | `instantNpc` | `createPRNG(\`instant-npc:${seed}\`)` — a ROOT composition, not a fork | Copy the shape (chair ruling 4) |
| Archetype table | `src/domain/factionArchetypes.js` | `FACTION_ARCHETYPES` | Frozen 13 values, executed | `faction.archetype` |
| Resource catalogue | `src/data/resourceData.js` | `RESOURCE_DATA`, `SPECIAL_RESOURCES` | Executed: **33** and **6** keys; each `RESOURCE_DATA` row carries `commodities: string[]` | `commodity`, read at its source. ⚠ Eager first-paint chunk — §6 bundle law |
| Tier ladder | `src/data/constants.js` | `TIER_ORDER` | `['thorp','hamlet','village','town','city','metropolis']` — order is MEANING | `tier`; the one pool exempt from the codepoint sort |
| **Wizard terrain set** | `src/generators/steps/resolveConfig.js` | `TERRAIN_WEIGHTS` | `[['plains',22],['hills',18],['forest',13],['riverside',16],['coastal',16],['mountain',9],['desert',6]]` — **executed: its seven keys are SET-EQUAL to the wizard's own seven `<option>` values** | `worldFact.terrain`. The wizard's canonical set, never a second copy |
| **Wizard culture set** | `src/generators/steps/resolveConfig.js` | `CULTURES` | Eleven, and its own header says it is *"Exported for the gallery facet-alignment contract (culture facet vocabulary must match the generator's own list)"* | `worldFact.culture`. The estate already treats this as THE canonical list |
| **Stressor vocabulary** | `src/data/stressTypes.js` | `STRESS_TYPE_MAP` | Executed: **15** keys, each `{ label, colour, probability, requiresTier, crisisHook, … }` | `worldFact.stressors` — the KEYS, never the labels |
| Stable order | `src/domain/deterministicSort.js` | `compareCodepoint` | The estate's one sanctioned, locale-free string order | Every pool's order except `tier` |
| Test precedent | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q — the institution founding year')` + seven straight-line `it` | One literal `describe`, no `.each`/nesting, positive control first | Copy this proof shape (preamble §P3.4) |
| Test precedent (tables) | `tests/domain/undercityStrataExistence.test.js` | MF-UC0 A1 | One `it` may walk a table and report a FULL offender list | Copy for the ten-pool arms |

**Forbidden alternatives:** no second catalogue, vocabulary, tier gate, PRNG stream, time source or
writer; **no second copy of a wizard option set** (chair ruling 5); no import of
`src/kernel/rngContext.js`, `src/generators/npcGenerator.js`, `src/data/namingData.js`, either
display seam, `src/components/**` or `src/store/**`; ⛔ **no import of
`src/components/ConfigurationPanel.jsx` or any JSX** — a wizard option read from a component is
both a layering violation and the "second copy" the ruling forbids; no edit to any existing file
(**this packet modifies ZERO**); no files outside the manifest.

---

## 6. Exact contracts

### Inputs and outputs

```js
/**
 * @typedef {{ tier?: string, institutions?: Array<{name?: string, role?: string}>,
 *   pantheon?: object, namingData?: object, culture?: string,
 *   terrain?: string, tradeRoute?: string }} PoolWorld
 *   The read bag. EVERY field is OPTIONAL and every absence is answered with [].
 */

export const POOLS;              // Readonly<Record<string, PoolSource>> — exactly the eleven ids
export function poolValues(poolId, world);        // → readonly string[]  (never null, never throws)
export function rollFrom(poolId, world, seed, entryId, n);   // → string | null (never undefined)
```

### The eleven pool ids — exact, closed, and their exact sources

| id | source kind | exact read | values at this base |
|---|---|---|---|
| `institution.class` | `catalogue` | `[...getInstitutionsForTier(world?.tier ?? 'village')]` | 85 at `town` |
| **`faction.category`** | `catalogue` | `Object.values(FACTION_ARCHETYPES)` | 13 |
| `cause.remove` | `literal` | frozen `['burned','died','dissolved','left','seized']` | 5 |
| `commodity` | `catalogue` | every `RESOURCE_DATA[k].commodities[]` flattened + `Object.keys(SPECIAL_RESOURCES)` | 33 rows + 6 |
| `tier` | `catalogue` | `TIER_ORDER` | 6 |
| **`npc.status`** | `catalogue` | the `NpcStatus` typedef's members, `src/domain/entities/npcs.js` | **6 — the TREE's** |
| **`institution.state`** | `catalogue` | the `EntityStatus` typedef's members, `src/domain/entities/status.js` | **5 — the TREE's** |
| `worldFact.terrain` | `catalogue` | `TERRAIN_WEIGHTS.map(([k]) => k)` | 7 |
| `worldFact.culture` | `catalogue` | `CULTURES` | 11 |
| `worldFact.stressors` | `catalogue` | `Object.keys(STRESS_TYPE_MAP)` | 15 |

### ⛔ THREE SPELLINGS CORRECTED BY THE CHAIR'S CONTRACT FACTS (lane P1's enumeration, §934.47 add. 2)

**C1 — `faction.archetype` becomes `faction.category`, and `stance` is DROPPED.** Measured: no
faction record carries `type` or `archetype`. `src/generators/power/rulingStructure.js`'s pushes
carry `faction` (the display name), `power`, `desc` and `isGoverning`; the archetype-like field is
**`category`**, read live at `economyReconciliation.js:68` and `relationshipArchetypes.js:10,55`.
⭐ **`archetype` is DERIVED, not stored** — `factionArchetype(faction)`
(`src/domain/factionArchetypes.js:103`) computes it from `f.category` — and design §14 is explicit
that *"a derivation is never editable, on any card."* So the editable ROOT is `category`, its pool
is the same thirteen values, and the pool id is spelled on the root. **No faction record carries a
`stance` either**, so that pool is dropped with it. `RELATIONSHIP_KIND_ORDER` is therefore **no
longer a required symbol of this packet** — it describes an edge between two factions, not a field
one owns, and an edge-editing op is not in wave 1's set. **RAISED R4.**

**C2 — the two state vocabularies are the TREE's typedefs, not design §15's prose.** The tree
already owns both, and both differ from §15:

| | design §15 says | the tree's canonical typedef | the difference |
|---|---|---|---|
| NPC status | present, exiled, jailed, dead, departed, missing | `NpcStatus` = **`'active'\|'dead'\|'missing'\|'exiled'\|'retired'\|'removed'`** (`src/domain/entities/npcs.js:30`) | `active` not `present`; `retired`+`removed` are the tree's; **no `jailed`**; no `departed` |
| institution state | active, impaired, ruined, destroyed, abandoned, under-construction | `EntityStatus` = **`'active'\|'impaired'\|'removed'\|'destroyed'\|'vacant'`** (`src/domain/entities/status.js:23`) | `removed`+`vacant` are the tree's; no `ruined`, `abandoned` or `under-construction` |

⛔ **The pools take the TREE's members**, because the chair's fact (3) also rules that the ops
layer's existing writers (`src/domain/entities/npcs.js`, `src/domain/events/mutateEntities.js`)
are the writer the op calls and **never a second path** — and a value outside `NpcStatus` would
break those writers' own type contract the moment it was written. Each typedef's members are read
as a frozen literal mirroring its source, with the source named in the row, so a typedef edit and
a pool edit are one review.
⚠ **`jailed` is the one value the chair named that the tree does not have.** It is not invented
here. **RAISED R5.**

⚠ **The readers that consume the two fields are named by the packet that ADDS each field** (design
§15's closing clause) — EM-A1/EM-B2, not this one. This packet mints the VOCABULARY only.

⛔ `cause.remove`'s five values are the owner's list (ODQ §934.36 addendum).

⛔ **`worldFact.terrain` and `worldFact.culture` are the WIZARD'S OWN SETS, read at the generator,
never re-typed.** The wizard renders them as `<option>` literals in
`src/components/ConfigurationPanel.jsx`; this leaf reads `TERRAIN_WEIGHTS` and `CULTURES` from
`src/generators/steps/resolveConfig.js` instead, and **A3 asserts the two agree**, so a future
drift between the wizard's menu and the generator's table is caught by this packet rather than
shipped as an unofferable option.

### State schema

**NONE.** Nothing is persisted, written or minted. `POOLS` is a frozen module constant;
`poolValues` and `rollFrom` are pure functions of their arguments.

Absence rules: **absent** (`world` null/undefined or the needed field missing) → the frozen empty
array; **empty** `[]` is a legal answer and is not distinguished from absence; **`null`** is
forbidden as a `poolValues` return and IS the `rollFrom` return for an empty pool; **invalid
legacy input** (non-string, duplicate, blank) is dropped in normalization — `String(v)`, trim,
drop `''`, dedupe — never repaired, never thrown on; **unknown `poolId`** → the frozen empty array
(membership is EM-A1's walker's business, not a runtime failure).

### Transition table

Not applicable: no state, no transitions. The row is omitted rather than filled with a
restatement of the read contract.

### Ordering and precedence

- **Pipeline/tick position:** NONE — outside generation and outside the pulse.
- **Merge/replace/deduplicate:** de-duplicated after normalization, first occurrence kept (order-
  independent, because the sort follows).
- **Stable enumeration:** `compareCodepoint` for every pool **except `tier`**, whose `TIER_ORDER`
  sequence is semantic (small→large) and preserved verbatim. Asserted in both directions (A4).
- **Tie-break:** none can occur — duplicates are gone and `compareCodepoint` is total.

### Determinism

- **Hash/fork key — the EXACT spelling, a ROOT composition, never a fork:**

  ```js
  createPRNG(`edit-pool:${poolId}:${String(seed)}:${entryId}:${n}`)
  ```

  then one `.pick(values)`.

  ⭐ A root composition with single-colon separators touches neither
  `EMBEDDED_DELIMITER_FAMILIES` nor the RESERVED head `epoch`, so
  `tests/kernel/prngForkLabelDelimiter.test.js` **cannot move for this packet** — and `instantNpc`
  already does exactly this. The head token is `edit-pool`, which is not `epoch`.
- **`n` is IN the key, not a number of advances**, so roll 3 is reproducible without replaying
  0–2 — the reopen guarantee of design §11. Advancing one stream would make roll 3 depend on
  whether 0–2 were ever taken, which reopening does not do.
- **Rounding/clamping:** none; no float is produced or rendered (prose-numerics not engaged).
- **No-draw behaviour — load-bearing:** `rollFrom` consumes **no world draw and no ambient draw**.
  It never imports `src/kernel/rngContext.js`, never calls `getActiveRng`/`setActiveRng`/`random`/
  `pick`/`chance`/`randInt`/`shuffle`/`weightedPick` from it, and never calls `Math.random`,
  `Date.now` or a locale-sensitive comparator. Inside an active seeded generation it leaves
  `_activeRng`'s position **unchanged**; outside one it does not throw. A6 asserts both halves.

### Bundle law

⛔ **No large data table is imported at module scope.** `src/data/resourceData.js` is imported
statically **only** because it is already in the eager first-paint `data` chunk (three first-paint
modules reach it) and adds no new edge; `src/data/stressTypes.js`,
`src/generators/steps/resolveConfig.js`, `src/domain/factionArchetypes.js` and
`src/domain/dossier/powerStrata.js` are small. ⚠ `src/data/namingData.js` (4,038 lines / ~68.6 kB)
is **A2b's** concern and is imported nowhere, in either packet — the culture bag is passed in
(chair ruling 4). A7 asserts the import list in both directions.

### Flag and dormancy

**Flag:** `NONE` — wave 1 is headless; `TIER_GATE.premium.editMode` is EM-D1's.
**Dormancy:** zero importers at this packet's tip (A2b adds the first, and it is a sibling, not a
consumer). **Golden posture:** `UNCHANGED` — `generatorGoldenMaster` and `dossierProseManifest`
must not move by one byte; structurally guaranteed, since nothing imports the leaf and it takes no
draw. **Motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Frozen module constant | pure reads | **Never** | n/a | Pools re-read live catalogues every call | n/a | **Nothing to migrate** | **Nothing to veil** |

⚠ The whole row is "nothing", and that is a verified claim: this leaf reads vocabularies and a
world bag and returns strings.

### Receipts and privacy

`NONE` — no receipt, no figure, no DM-only field, no projection. Those are EM-B3's (§P2.6).

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: this leaf offers values and ranks nothing; it reads no alignment,
  law or temper axis.`
- **Edit story:** `ENGINE-ONLY: the DM's verb is EM-D2's PoolField; this is the catalogue beneath
  it and has no surface.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/pools.js` | `POOLS`, `poolValues`, `rollFrom` | **250 eff (cap); ≈143 estimated** | The machinery of §6 and exactly the eleven table pools. Read every vocabulary at its source module. Import no JSX, no `rngContext`, no `namingData`. Leave the file's structure open for A2b to append rows. |
| `CREATE` | `tests/domain/editPools.test.js` | A1–A8 | `n/a` | ONE literal `describe`, **eight straight-line `it`**, no `.each`/`runIf`/nesting (§P3.4). Table arms report a FULL offender list. Negatives carry `// anchored:` on the line immediately above. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the tuple in `.lighting-census-baseline.json` | `n/a` | ⛔ **DEFERRED TO THE TRAIN TERMINAL** — no edit is made. See the box below. |

Generated artifacts: `NONE`. ⛔ **Edge-shared closure NOT owed** — zero existing files modified,
so no closure input moves.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — `+1 file`, INTERIOR RED** | `files` is `TEST_FILES.length` over `tests/**/*.test.js` (`:515`, `:612`), so the driver is the new TEST file, **not** the `src/domain` leaf. The chair's ruling (8) accepts this. From `2645/383/2262/25009/6670`: `+1/+0/+1/+8/+1`. Re-derived whole at the terminal (§P3.2). |
| P2.2 | mutation-coverage row | **NOT OWED** | `tests/lint` is the first ENFORCER DIR (`mutationCoverage.shared.mjs:36-37`); this packet's only test file is `tests/domain/`. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key (`dmLayer`, `decrees`) is read. The scanner covers every `.js` under `src/` (`:250`), so the leaf IS scanned and the check is in `checks`. |
| P2.4 | writer-reach | **CANNOT MOVE** | `SURFACE_CLOSURE_STOP` includes `'src/store/'` (`writer-reach-scan.mjs:115-117`); this leaf reaches a surface only through `src/store/editSlice.js`. |
| P2.5 | decision-fork + mechanism-coverage rows | **NOT OWED — measured** | `chooserTotality`'s `SCAN_ROOTS` are `src/domain/{worldPulse,spatial,traditions,region}` (`:64-69`) — `src/domain/edit` is not among them; the mechanism walker enumerates `src/domain/worldPulse`. The same measured form `flagConstraints.mjs` used for §85.4. **RAISED R2.** |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |

> ⛔ **THE SHARED CENSUS ROW IS DEFERRED (§417 / MF-T2Q shape).** Every wave-1 EM member adding a
> test file owes the same re-record, and `implementation-packets.mjs` refuses one path claimed by
> more than one NON-TERMINAL packet — **DRAFT reserves exactly as READY does.** No edit is made;
> the chair inserts this row once, at the terminal:
>
> ```json
>         { "action": "TEST", "path": "tests/lint/sovereigntyLightingContract.walker.test.js" }
> ```
>
> ⚠ **INTERIOR RED, NAMED IN ADVANCE:** the walker reds at this member's tip with
> `the estate's file count moved — re-measure, do not re-word: expected 2646 to be 2645`.
> ⭐ `EM-A2a.manifest.json` therefore **omits** that path.

---

## 8. Ordered coding sequence

0. Dispatch and seal; re-read `git rev-parse HEAD` in the same command (the base has moved ten
   times).
1. Capture the baseline: the five census figures; `sha256` of
   `tests/fixtures/generator-golden-master.json` before any edit.
2. Add `tests/domain/editPools.test.js` with A1–A8 **failing**.
3. Implement: `rollFrom`'s stream and the normalizer first, then the five frozen literal
   vocabularies, then the six catalogue readers, then `POOLS` and `poolValues`.
4. Sole writer / lifecycle seam: **NOT APPLICABLE** — record the step as skipped.
5. Wire consumers: **NOT APPLICABLE** — lands DARK. Record as skipped.
6. Registrations: none owed (§7). The prevention guard is A7, inside the acceptance file.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan; write the completion receipt.

```text
rollFrom:
1. values = poolValues(poolId, world)
2. if values.length === 0 -> return null                 // the typed absence, NOT undefined
3. if !Number.isInteger(n) || n < 0 -> n = 0             // clamp, never throw
4. rng = createPRNG(`edit-pool:${poolId}:${String(seed)}:${entryId}:${n}`)
5. picked = rng.pick(values)                             // exactly one draw on OUR stream
6. return picked === undefined ? null : picked           // step 2 makes this unreachable; kept
                                                          // because pick's contract is undefined

poolValues:
1. src = POOLS[poolId]; if !src -> return EMPTY (the one frozen [])
2. raw = src.values ?? src.read(world ?? {})
3. if !Array.isArray(raw) -> return EMPTY
4. normalize: String(v) -> trim -> drop '' -> dedupe, first occurrence kept
5. if poolId === 'tier' -> keep TIER_ORDER's sequence   // the ONE stated exception
   else                 -> sort with compareCodepoint
6. return Object.freeze(result)
```

---

## 9. Acceptance matrix

`tests/domain/editPools.test.js`, one literal `describe`, eight straight-line `it`.

| ID | Case | Required observation |
|---|---|---|
| **A1** | **Main + GUARD-THE-GUARD, first** | `POOLS` holds exactly the ten ids of §6 (set-equal both directions, full offender list). Every pool returns a frozen, non-empty, duplicate-free `string[]` on a real town world — asserted BEFORE any negative so no later arm passes on nothing. `institution.class` is exactly **85** and set-equals `[...getInstitutionsForTier('town')]`; `faction.category` set-equals `Object.values(FACTION_ARCHETYPES)` (13); `tier` equals `TIER_ORDER` (6). |
| **A2** | **Absence is the typed value; nothing throws** | `null`, `undefined`, `{}`, `{tier:'nonsense'}`, `{institutions:null}` and an unknown pool id each return a **frozen array** — never `null`, never `undefined`, never a throw — and `rollFrom` returns **`null`** for each empty pool. A `tier` of `'random'`/`'custom'`/absent yields the VILLAGE catalogue (lookups' own special case), anchored against `'nonsense'` → `[]`. |
| **A3** | **⛔ SOURCE IDENTITY, AND WIZARD PARITY** | Each catalogue pool set-equals its source live. A source scan proves the module imports **neither display seam and no JSX at all** (matcher proved live on a planted string). ⭐ **`worldFact.terrain` set-equals the wizard's own seven `<option>` values** — read from `ConfigurationPanel.jsx` by the TEST, never by the module — and `worldFact.culture` set-equals `CULTURES` (11), so a drift between the wizard's menu and the generator's table reds HERE. The tier gate is proved LIVE: a `minTier:'metropolis'` row is absent from `institution.class` at `city`, present at `metropolis`. |
| **A4** | **Boundary: stable order and the ONE exception** | Every pool except `tier` is in `compareCodepoint` order (re-sort and compare). `tier` is `TIER_ORDER` **verbatim** and is asserted NOT codepoint-sorted (`'city'` precedes `'hamlet'` alphabetically but follows it here), pinning the exemption in both directions so it cannot be silently "fixed". |
| **A5** | **Idempotency and the reopen guarantee** | `rollFrom(p,w,s,e,3)` returns the same value on three calls (`toBe`). Rolls 0–9 are taken in order, then roll 3 is taken **alone on a fresh call** and equals the earlier roll 3. Different `entryId`s at the same `n` differ for at least one pool, and different `seed`s likewise — both key segments proved live. |
| **A6** | **⛔ THE NO-DRAW LAW AND THE GOLDEN'S STRUCTURAL PROOF** | With `setActiveRng(createPRNG('probe'))` live, the ambient sequence is fixed by recording two draws; after re-seeding, **fifty `rollFrom` calls across all ten pools** are made and the NEXT ambient draw is asserted equal to the recorded second value — the world's stream did not advance by one step. With **no** active RNG, `rollFrom` does not throw. Plus: a scan over `src/**` finds **zero** importers of the leaf, with guard-the-guard arms on the walk and the matcher. |
| **A7** | **THE IMPORT FENCE, both directions (the prevention guard)** | The import list is asserted EXACTLY: it contains `src/kernel/prng.js`, `src/generators/lookups.js`, `src/domain/factionArchetypes.js`, `src/domain/dossier/powerStrata.js`, `src/data/resourceData.js`, `src/data/constants.js`, `src/generators/steps/resolveConfig.js`, `src/data/stressTypes.js`, `src/domain/deterministicSort.js` — and **none of** `src/kernel/rngContext.js`, `src/data/namingData.js`, `src/generators/npcGenerator.js`, any `*.jsx`, any `src/components/**` or `src/store/**` path. Proved non-empty first. |
| **A8** | **⛔ THE TWO STATE VOCABULARIES ARE THE TREE'S** | `npc.status` set-equals the `NpcStatus` typedef's six (`active, dead, exiled, missing, removed, retired`) and `institution.state` the `EntityStatus` typedef's five (`active, destroyed, impaired, removed, vacant`) — exact sorted lists, never lengths, both frozen, each parsed from its own source file by the TEST so a typedef edit reds here. ⭐ `destroyed` and `removed` are both present and DISTINCT, which is design §15's "destruction is a state the record keeps; removal is erasure" made structural. ⚠ `jailed` (design §15's prose) is asserted ABSENT by name, so its absence is a recorded verdict rather than an oversight. |

**8 of ≤8.** Omit nothing; add nothing during implementation.

---

## 10. Verification commands

```sh
npx eslint src/domain/edit/pools.js tests/domain/editPools.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict          # src/domain/edit/** must be strict-clean (§P4)

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editPools.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/kernel/prngForkLabelDelimiter.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-A2a
npm run implementation:resume -- EM-A2a
```

Expected: every command exits `0`, **except** the named interior red on the census walker until
the terminal. ⛔ Never read a gate through a shell pipe (§P7). A member never runs `npm run check`.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: the seal is missing or foreign; **HEAD is
not `d31af2cee` or a descendant proved non-interfering by execution**; `pools.js` measures
**> 250 effective lines** under eslint's own `Linter` with `skipBlankLines` and `skipComments`
(take a further split — **never squeeze**, per the chair's ruling); a golden or the prose manifest
moves by one byte; `prngForkLabelDelimiter.test.js` moves (`rollFrom` reached for `fork` or spelled
`::`); A6 shows the ambient sequence advancing; the leaf would need `namingData.js`,
`npcGenerator.js`, `rngContext.js` or any `.jsx` to satisfy an arm; **A3's wizard-parity arm reds**
(the wizard's menu and the generator's table have drifted — a finding, not a thing to repair here);
a pool would need a value the engine does not hold (that belongs in the compendium, the design's
stated valve); `getInstitutionsForTier` is found to return anything but a `Set`.

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas
(measured with eslint's `Linter`) · acceptance A1–A8 executed · focused commands, exits and counts
· sealed per-step receipt and resume status · both typecheck configurations · gate stages actually
executed · base-versus-wave failure identity diff · dormancy/golden result (fixture digest before
and at the tip) · the ambient-stream no-draw proof · census tuple before and at the tip with the
interior red quoted verbatim · generated artifacts `NONE` · deviations `NONE | STOP` ·
out-of-scope observations without investigation · **judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | **ARCH §9's `Pools:` line still lists nine pools** and names neither the world-facts pools nor the two §15 vocabularies, although §934.46 amended its op list in the same commit. A documentation correction, not a build question. |
| **R2** | **The decision-fork and mechanism-coverage registers do not reach `src/domain/edit`** (`chooserTotality` `SCAN_ROOTS`; the mechanism walker's worldPulse enumeration). The editor's seeded chooser is registered nowhere. Recorded NOT OWED by measurement; the gap is real. Grow the roots (a register act, its own member), or accept the gap on record. |
| **R3** | **The A2a/A2b split is taken** per ruling (5), on the pre-declared table-vs-world line. A2b carries one **BLOCKED** row — see `EM-A2b.md` §2. |


---

## 14. REVISION 2 — the chair's three contract facts (§934.47 addendum 2)

Fact (2) lands here in full: **no faction record carries `type` or `archetype`; the field is
`category`**, and `archetype` is a DERIVATION (`factionArchetype(f)` from `f.category`), which
design §14 forbids editing. The pool is therefore `faction.category` over the same thirteen
values, and **`stance` is dropped** — no faction record carries one either, and an edge between
two factions is not a field one owns. `RELATIONSHIP_KIND_ORDER` leaves `requiredSymbols` with it.
Fact (3) lands as **C2**: both state vocabularies are the tree's own typedefs, not §15's prose.
Facts (1) is EM-B1a's. Pools: eleven → **ten**. Estimate: ≈147 → **≈143**.
