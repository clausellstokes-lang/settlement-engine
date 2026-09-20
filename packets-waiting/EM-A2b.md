# Settlement editor / EM-A2b — the seven WORLD-DERIVED pools, and the one world fact the estate has no canonical option list for

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
  ⭐⭐ **THE BLOCK IS RESOLVED — by the chair's own EM-P3, not by this lane.** This packet was
  compiled BLOCKED on `worldFact.tradeAccess` (no canonical option list; the wizard's six
  disagreeing with the generator's five). At `e02bf0f26` the chair has placed
  `docs/implementation/packets/settlement-editor/EM-P3.md` — *the world-fact option sets' one
  home* — which reaches the SAME measured contradiction independently (its P-4: *"TRADE ACCESS HAS
  NO CANONICAL LIST ANYWHERE … This is a MINT, not a move"*) and mints
  `src/data/worldFactOptions.js#TRADE_ACCESS` with a domain re-export. **This packet therefore
  depends on EM-P3 and is DRAFT**; §2 is retained as the finding's record.
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠ Ten commits moved the branch under this lane (11:01→11:33 EDT), all docs plus two unrelated
  files; `d31af2cee` **IS an ancestor** of `7aa769830` and **every measured path is blob-identical
  across the window** (evidence §0). Held at `d31af2cee` per the chair's ruling (6).
- **Last revalidated:** 2026-09-19 11:33 EDT, `d31af2cee`
- **Depends on:** **`EM-P3`** (the world-fact option sets' one home — it mints `TRADE_ACCESS` and gives the other six a single domain-reachable address) and **`EM-A2a`** — this packet APPENDS rows to A2a's `POOLS` and uses its
  `poolValues` / `rollFrom` machinery unchanged. A2a lands first. Also `EM-A1` (name-only).
- **Collision group:** **`EM-A2a`** — one shared production file, `src/domain/edit/pools.js`, and
  one shared test file, `tests/domain/editPools.test.js`. ⛔ **They must serialize**, and this
  packet's arms re-assert A2a's totality so a dropped row reds. Measured: all 182 registered
  packets are TERMINAL, so nothing in the manifest reserves either path.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: `NAMING_DATA` 11 cultures, all
  name-complete; `pantheonStandings` returns `[]` when the pantheon is absent;
  `getCompatibleResources('port','coastal')` → an **array of 33 objects** each carrying `key`,
  `label`, `desc`, `commodities`; `GOODS_CATEGORIES` 7 keys; `INSTITUTION_SERVICES` **285** keys;
  `TERRAIN_ROUTE_POOLS` is **not exported** and holds five values; the wizard's trade menu holds
  six. Census tuple `2645 / 383 / 2262 / 25009 / 6670`. No test was run.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
  ⓘ Per the chair's ruling (6) this lane does not stamp it; the hash has moved with each ruling.

---

## 1. Reconciled authority

1. **THE CHAIR'S RULINGS, 2026-09-19** (§934.36 addendum, §934.46): **(4)** names take the
   `instantNpc` shape — a root-composed PRNG with the culture bag passed in; **(5)** the pools gain
   the world-facts pools, *"the wizard's own option sets for terrain, culture, trade access,
   resources, goods, services, stressors — find the wizard's canonical option lists by symbol and
   name them; **never a second copy**"*, with the pre-declared A2a/A2b split used if over the cap;
   **(6)** the base stays `d31af2cee`; **(8)** the census counts test files.
2. **ODQ §934.45 / design §14 FINAL** — *"the editor edits them on a fifth card, whose pools are
   the wizard's own option sets"*; a change never re-rolls, it re-derives with pins.
3. **THE PROMISE**; the **deity doctrine** — faith is culture, never theology, so the deity pool
   reads the WORLD's pantheon and holds no premade list.
4. **design §12.7 GOVERNS** — the generator's catalogue, never the display seams.
5. **`EM-PREAMBLE.md`** §P2–§P5 (HZ-PRNG), §P8 — cited by hash.
6. Live code at `d31af2cee` — which refutes ruling (5)'s premise for one of the seven world facts.

**Resolved contradictions:**

- "names from the culture's generator" → **REFUTED** and cured by the chair's ruling (4): no
  exported, seedable name generator exists (the only export draws on the ambient fail-closed
  `rngContext`), so the pool reads the generator's name **DATA** and rolls on its own stream, the
  `instantNpc` shape. Closed by ruling.
- "the wizard's canonical option lists" → **REFUTED FOR `tradeAccess` ONLY.** §2.

---

## 2. ⛔ THE BLOCK — the smallest measured contradiction

**The premise:** ruling (5) and design §14 say each world-fact pool is *the wizard's own option
set*, named **by symbol**, and **never a second copy**.

**The measurement.** For six of the seven world facts a canonical symbol exists and this packet
names it. For **trade access it does not**, and the two live sets **disagree**:

```
$ sed -n '325,331p' src/components/ConfigurationPanel.jsx          # the WIZARD's menu
  <option value="random_trade">Random</option>
  <option value="road">Road</option>          <option value="river">River</option>
  <option value="port">Port</option>          <option value="crossroads">Crossroads</option>
  <option value="isolated">Isolated</option>  <option value="mountain_pass">Mountain Pass</option>

$ node -e '<extract TERRAIN_ROUTE_POOLS from src/generators/steps/resolveConfig.js>'
["crossroads","isolated","port","river","road"]
exported? false
```

Three facts follow, and each is load-bearing:

1. **The wizard's set lives only as JSX `<option>` literals** in a component. Reading it would
   make `src/domain/edit/pools.js` import `.jsx` — a layering violation (§P4: `src/domain/edit/**`
   imports nothing from `src/components`) — and re-typing it is precisely the **"second copy"** the
   ruling forbids.
2. **The generator's set is a module-PRIVATE `const`** (`TERRAIN_ROUTE_POOLS`, not exported), so
   there is no symbol to name.
3. **The two sets are not the same set.** The wizard offers **six**; the generator rolls **five**.
   `mountain_pass` is offerable in the wizard and is drawn by the generator **never** — so even
   "use the generator's five" would silently narrow a menu the owner ships today, and "use the
   wizard's six" would put a value into a pool no chooser has ever produced.

⛔ **This is an authority disagreement between two higher sources — the shipped wizard and the
shipped generator — and the standard is explicit: the packet is BLOCKED and a coding agent never
adjudicates it.** No instruction for `worldFact.tradeAccess` is written below.

**The two unblock paths, costed, so the ruling is one read:**

| path | act | cost | consequence |
|---|---|---|---|
| **U1 — mint the canonical list** | `export const TRADE_ROUTE_OPTIONS` in `src/generators/steps/resolveConfig.js`, derived from `TERRAIN_ROUTE_POOLS` **plus** `mountain_pass` with its reason recorded, and re-point the wizard's six `<option>`s at it | a production MODIFY of a generator file **and** a component — outside this packet's zero-modify posture, so **its own small member** | one truth; the wizard's menu and the pool can never drift again; the `mountain_pass` gap becomes visible rather than latent |
| **U2 — rule the pool the generator's five** | the pool is `TERRAIN_ROUTE_POOLS`' five, exported as-is; `mountain_pass` is recorded as a wizard-only value the editor does not offer | one export line | the editor offers less than the wizard, deliberately, with the reason on record |

⚠ **`mountain_pass` is an out-of-scope finding either way** and is recorded here without
investigation, per the edge-case budget: a value the wizard offers that the generator never rolls
is a pre-existing estate condition this packet neither caused nor may repair.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | `0` — **it extends A2a's leaf** | ≤2 |
| Existing logic-bearing production files modified | **`1`** (`src/domain/edit/pools.js`, A2a's) | ≤3 |
| Handwritten files total | `2` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≈97 (estimate), 7 pools** | ≤400 |
| Effective lines per new leaf | `n/a` — creates no leaf | ≤250 |
| **Combined `pools.js` after A2a + A2b** | **≈244 of 250 (estimate)** | ≤250 |
| Delta in a shared/hot file | `0` — `pools.js` is a SIBLING's file, not a hot-list file | ≤15 |
| Acceptance cases | `7` | ≤8 |

Overrides approved before dispatch: `NONE`. **HOT FILES: none named** — `pools.js` is new in this
train and carries no `scripts/.size-baseline.json` entry and no ceiling of its own.

⚠⚠ **THE COMBINED FIGURE IS THE ONE THAT BINDS, AND IT HAS SIX LINES OF MARGIN.** A2a ≈147 plus
this packet's ≈97 is **≈244 against the 250 cap**. That is an estimate over code that does not
exist, and it is close. **Both packets carry the same STOP at §11**, and if the combined leaf
measures over at implementation the next split is pre-declared here: **EM-A2c** takes the three
`worldFact.resources|goods|services` rows (≈40 effective), which are the only rows in this packet
that read a route or a terrain rather than a roster. ⛔ **Do not squeeze the rows to fit** — the
chair's own instruction, and the estate's hot-file lesson.

Decomposition of the ≈97: two name rows + the culture resolver ≈ 26; `npc.role` derivation ≈ 14;
`deity` ≈ 6; `worldFact.resources` ≈ 12; `worldFact.goods` ≈ 6; `worldFact.services` ≈ 12; row
scaffolding and imports ≈ 21. **`worldFact.tradeAccess` is NOT costed — it is BLOCKED.**

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-A2b
```

⛔ **Dispatch is refused while the status is BLOCKED** (`PACKET_STANDARD.md`: "packet status is
not READY" is a mandatory STOP). When the chair rules R1 and the status moves, expect: **`CREATE`
targets NONE**; **non-CREATE targets `src/domain/edit/pools.js` and
`tests/domain/editPools.test.js` PRESENT AND CLEAN** — which is only true once **EM-A2a has
landed**, so this packet's ancestry check is also its dependency check; every `requiredSymbols`
row resolving.

⚠ **A2a and A2b share both files and must serialize.** Dispatching this one while A2a is
non-terminal reds `validate:packets` on the duplicate path.

---

## 5. Verified tree contract

Every row found BY SYMBOL at `d31af2cee`; commands in `EM-A2b.evidence.md`.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Name DATA | `src/data/namingData.js` | `NAMING_DATA` | Executed: **11** culture keys, **all 11** carrying `maleNames`, `femaleNames`, `surnames`; plus `settlementPrefixes` / `settlementSuffixes`. 4,038 lines / ~68.6 kB | The name source — **passed in as `world.namingData`**, never imported (bundle law, §6) |
| Roll precedent | `src/domain/npc/npcOps.js` | `instantNpc`, `pickFromNaming` | `createPRNG(\`instant-npc:${seed}\`)` — a ROOT composition; `pickFromNaming(rng, cultureData, gender)` takes the culture bag as a PARAMETER | **Copy exactly** (chair ruling 4) |
| ⛔ The refuted export | `src/generators/npcGenerator.js` | `generateSettlementName` | `(r = 'germanic') => string`, whose body reads `_rng()` = `random` from `src/kernel/rngContext.js` (`:16`) — the ambient context, which **throws** with none active and **steals a world draw** with one. `pickFirst` is not exported at all | ⛔ Called nowhere. Named so the refutation is findable from the manifest |
| Pantheon reader | `src/domain/display/pantheonDepth.js` | `pantheonStandings` | `(worldState) => Array<{id, seats, wins, losses, tier, fromMajor}>`, sorted descending seats then codepoint id; **`[]` when dormant or absent** (`:100`) | The ONLY source of `deity` — the WORLD's pantheon, never a list (deity doctrine) |
| **Resource compatibility** | `src/domain/resourceTerrainCompatibility.js` | `getCompatibleResources` | `(route, terrain = null) => Array<object>`; executed at `('port','coastal')` → **33 objects**, each `{ key, label, desc, commodities, … }`. Re-exported by `src/generators/terrainHelpers.js:12`, which is what the wizard's panel imports | `worldFact.resources` — the wizard's own gated set, read at its canonical home. ⭐ Map to `.key`, never `.label` |
| **Goods vocabulary** | `src/data/tradeGoodsData.js` | `GOODS_CATEGORIES` | Executed: **7** keys — `AGRICULTURAL, RAW_MATERIALS, MANUFACTURED, LUXURY, SERVICES, FOOD_PROCESSED, TRADE` | `worldFact.goods` — the category vocabulary the wizard's goods toggles are keyed on |
| **Services vocabulary** | `src/data/institutionServices.js` | `INSTITUTION_SERVICES` | Executed: **285** keys (re-exported by `tradeGoodsData.js:138`) | `worldFact.services` — read at the source module, not the re-export |
| ⛔ **THE BLOCKED SOURCE** | `src/generators/steps/resolveConfig.js` | `TERRAIN_ROUTE_POOLS` | **NOT EXPORTED** (measured); holds five values `crossroads, isolated, port, river, road`, against the wizard's six | ⛔ **Unreachable. §2's block.** Named so the contradiction is findable from the manifest |
| Stable order | `src/domain/deterministicSort.js` | `compareCodepoint` | The estate's one sanctioned, locale-free string order | Every pool's order |
| **A2a's machinery** | `src/domain/edit/pools.js` | `POOLS`, `poolValues`, `rollFrom` | ⚠ **Does not exist at this base** — EM-A2a creates it. This packet extends it | Extend; never fork a second `poolValues` or a second stream |
| Test precedent | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q …')` + seven straight-line `it` | One literal `describe`, no `.each`/nesting, positive control first | Copy this shape (§P3.4) |

**Forbidden alternatives:** ⛔ **no import of `src/data/namingData.js`** — the culture bag is passed
in; ⛔ **no import of any `.jsx` or anything under `src/components/**`** (§P4, and §2's whole
point); no second `poolValues`, second stream, second pantheon read or second resource gate; no
import of `src/kernel/rngContext.js` or `src/generators/npcGenerator.js`; no premade deity list
anywhere; no edit to any existing file **other than A2a's two**; no files outside the manifest.

---

## 6. Exact contracts

### The seven pool ids — exact, closed, and their exact sources

| id | source kind | exact read | values at this base |
|---|---|---|---|
| `name.settlement` | `generator` | `world.namingData[culture]`: `settlementPrefixes` × `settlementSuffixes`, concatenated | per culture |
| `name.npc` | `generator` | `world.namingData[culture]`: `maleNames` + `femaleNames`, then `' '` + a `surnames` member | per culture |
| `npc.role` | `world` | the distinct non-empty `role` of `world.institutions[]`, plus each institution's `name` where `role` is absent | world-derived |
| `deity` | `world` | `pantheonStandings(world).map(e => e.id)` | world-derived; `[]` when dormant |
| `worldFact.resources` | `world` | `getCompatibleResources(world?.tradeRoute ?? 'road', world?.terrain ?? null).map(r => r.key)` | 33 at `('port','coastal')` |
| `worldFact.goods` | `catalogue` | `Object.keys(GOODS_CATEGORIES)` | 7 |
| `worldFact.services` | `catalogue` | `Object.keys(INSTITUTION_SERVICES)` | 285 |
| ⛔ `worldFact.tradeAccess` | — | **BLOCKED (§2)** | — |

⛔ **`worldFact.resources` maps to `.key`, never `.label`.** `getCompatibleResources` returns
objects; the pool's values must be the engine's own keys, because a label is a display string and
a pool is a fact set. A pool of labels would be the display-seam mistake §12.7 forbids, arriving
by a different door.

⛔ **`deity` reads the world and holds no list.** The deity doctrine is constitutional: faith is
culture, never theology. A world with no pantheon yields `[]`, and A8 proves no premade deity
array exists anywhere in the module.

### Inputs and outputs

Unchanged from EM-A2a — this packet adds no export and changes no signature:

```js
export const POOLS;              // gains SEVEN rows; the eleven A2a rows are untouched
export function poolValues(poolId, world);        // unchanged
export function rollFrom(poolId, world, seed, entryId, n);   // unchanged
```

`PoolWorld` gains two already-declared optional fields in use here — `namingData` and `terrain` /
`tradeRoute` — both optional, both answered with `[]` when absent.

### State schema

**NONE.** Nothing persisted, written or minted.

Absence rules — **identical to A2a and deliberately not re-specified in a second place**: absent
and empty both yield the frozen empty array; `null` is forbidden as a `poolValues` return and IS
`rollFrom`'s empty answer; invalid members are dropped in normalization; an unknown id yields `[]`.
⭐ For this packet that rule does real work: **a world with no `namingData` yields `[]` for both
name pools rather than reaching for the real table**, which is the whole point of passing the bag
in (A7).

### Transition table

Not applicable: no state, no transitions.

### Ordering and precedence

Pipeline position **NONE**. Stable enumeration: `compareCodepoint` for all seven (no exception —
`tier` is A2a's). De-duplication first-occurrence-kept, then the sort, so order-independent.

### Determinism

- **Hash/fork key:** A2a's, unchanged and **not re-spelled here** —
  `createPRNG(\`edit-pool:${poolId}:${seed}:${entryId}:${n}\`)`, a ROOT composition with
  single-colon separators, never `fork`, so `tests/kernel/prngForkLabelDelimiter.test.js` cannot
  move. §P5 HZ-PRNG requires the key be spelled **once, in EM-A2**; A2a is where it lives.
- **No-draw behaviour:** unchanged and load-bearing. ⭐ It is this packet that would have broken it
  had the charter's "culture's generator" clause been followed literally — `generateSettlementName`
  consumes a world draw. A6 re-asserts the law across the combined pool set.
- **Rounding/clamping:** none; no float produced or rendered.

### Bundle law — the constraint that shapes the name pools

⛔ **`src/data/namingData.js` is imported NOWHERE.** It is 4,038 lines / ~68.6 kB, and
`src/domain/townCartography/cartographyWards.js:19-21` records the estate refusing that exact
import into a bounded leaf for that exact reason. `pools.js` reaches the first-paint graph through
`src/store/editSlice.js` (EM-C4). The culture bag is therefore **passed in**, exactly as
`instantNpc` takes `namingData` — the chair's ruling (4). `src/data/tradeGoodsData.js` and
`src/data/institutionServices.js` are static imports and their first-paint effect is an
out-of-scope observation for the implementer's receipt, not a claim this lane measured.
⚠ **RAISED R2** — this lane did NOT measure whether those two modules are already in the eager
closure. An unmeasured path is not a verified fact.

### Flag and dormancy

**Flag:** `NONE`. **Dormancy:** zero importers. **Golden posture:** `UNCHANGED` — structurally,
since nothing imports the leaf and it takes no draw. **Motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Frozen rows on A2a's constant | pure reads | **Never** | n/a | Re-read live every call | n/a | **Nothing to migrate** | **Nothing to veil** — `pantheonStandings` reads public standings only |

### Receipts and privacy

`NONE` — no receipt, no figure, no DM-only field, no projection.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: the deity pool returns the world's own pantheon IDS and reads no
  alignment, law or temper field. A pool that ranked deities would cross the doctrine's line.`
- **Edit story:** `ENGINE-ONLY: the DM's verb is EM-D2's PoolField and the fifth world-facts card;
  this packet is the catalogue beneath them.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/edit/pools.js` | seven new rows in `POOLS` + their readers | **+97 eff (estimate); the COMBINED file ≤250** | Append the seven rows of §6 and their readers. Change no existing row, no signature and no stream key. ⛔ Import no `namingData.js`, no `.jsx`, no `rngContext`. ⛔ Write no `worldFact.tradeAccess` row — it is BLOCKED. |
| `MODIFY` | `tests/domain/editPools.test.js` | seven new `it` arms (B1–B7) | `n/a` | Append to A2a's single literal `describe`; straight-line `it`, no `.each`/nesting (§P3.4). Re-assert A2a's eleven ids so a dropped row reds. Negatives carry `// anchored:` on the line immediately above. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the tuple | `n/a` | ⛔ **DEFERRED TO THE TERMINAL** — no edit. |

Generated artifacts: `NONE`. ⛔ **Edge-shared closure NOT owed** — the only modified production
file is a leaf this train creates, which is in no bundle closure.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — `+0 files`, `+7 titles`** | This packet adds **no new test file** — it appends arms to A2a's. `files` is `TEST_FILES.length` (`:612`), so only `titles` moves: `+0/+0/+0/+7/+0`. ⭐ A **smaller** obligation than a naive reading predicts, and stated so the terminal's re-derivation is not surprised. |
| P2.2 | mutation-coverage row | **NOT OWED** | No `tests/lint/` file is added (`mutationCoverage.shared.mjs:36-37`). |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key read. The scanner covers every `.js` under `src/` (`:250`); the check is in `checks`. |
| P2.4 | writer-reach | **CANNOT MOVE** | `SURFACE_CLOSURE_STOP` includes `'src/store/'` (`writer-reach-scan.mjs:115-117`). |
| P2.5 | decision-fork + mechanism-coverage | **NOT OWED — measured** | `chooserTotality`'s `SCAN_ROOTS` are the four worldPulse-family dirs (`:64-69`); `src/domain/edit` is not among them. (A2a's R2.) |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |

> ⛔ **THE CENSUS ROW IS DEFERRED (§417 shape)** — DRAFT reserves as READY does, so no edit is made
> and `EM-A2b.manifest.json` **omits** the path. Predicted interior red at this member's tip:
> a title-count mismatch, not a file-count one.

---

## 8. Ordered coding sequence

0. Dispatch and seal — **only after the chair rules R1 and EM-A2a has landed**; re-read
   `git rev-parse HEAD` in the same command.
1. Capture the baseline: the census figures; `sha256` of `tests/fixtures/generator-golden-master.json`.
2. Append B1–B7 to `tests/domain/editPools.test.js`, **failing**.
3. Implement the seven rows: the two name pools and the culture resolver first (the `instantNpc`
   shape), then `npc.role`, `deity`, then the three world-fact readers.
4. Sole writer / lifecycle seam: **NOT APPLICABLE** — record as skipped.
5. Wire consumers: **NOT APPLICABLE** — lands DARK. Record as skipped.
6. Registrations: none owed. The prevention guard is A7 (the import fence), extended.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan; write the completion receipt.

```text
name.npc (the instantNpc shape, adapted to a POOL rather than a single roll):
1. bag = world?.namingData?.[world?.culture ?? 'germanic'] ?? null
2. if !bag -> return []                     // never reach for the real table
3. first = [...(bag.maleNames ?? []), ...(bag.femaleNames ?? [])]
4. last  = bag.surnames ?? []
5. values = last.length ? first.flatMap(f => last.map(l => `${f} ${l}`)) : first
6. normalize + dedupe + compareCodepoint    // A2a's shared normalizer, not a second one
```

⚠ **Step 5's cross product can be large.** At this base the largest culture's product is bounded
by `maleNames.length + femaleNames.length` times `surnames.length`; the implementer **measures it
at step 2 and reports the figure**, and if any single pool exceeds what a drop-down can hold, that
is an out-of-scope observation for the receipt and a `PoolField` search-affordance question for
EM-D2 — **not** a reason to truncate a pool here. Truncation would make `rollFrom` non-total over
the value set and is a STOP.

---

## 9. Acceptance matrix

Seven arms appended to A2a's single literal `describe`.

| ID | Case | Required observation |
|---|---|---|
| **B1** | **Main + GUARD-THE-GUARD, and A2a's totality re-asserted** | `POOLS` now holds exactly **eighteen** ids — A2a's eleven **plus** these seven — set-equal both directions with a full offender list, so a row dropped by either packet reds here. Every new pool returns a frozen, duplicate-free `string[]` on a real world, asserted before any negative below. |
| **B2** | **Absence is the typed value** | A world with **no `namingData`** yields `[]` for both name pools; a world with no `pantheon` yields `[]` for `deity`; a world with no `institutions` yields `[]` for `npc.role`; `null`/`undefined`/`{}` never throw for any of the seven. Anchored against a populated control in the same arm. |
| **B3** | **⛔ THE PASSED-IN BAG, AND THE IMPORT FENCE (counterforce)** | A `namingData` bag carrying **one invented prefix** produces a `name.settlement` value containing it — proving the pool draws from the SUPPLIED bag and never reaches for the real table behind the caller's back. A source scan proves `pools.js` imports **neither `src/data/namingData.js` nor `src/generators/npcGenerator.js` nor any `.jsx`**, with the matcher proved live on a planted string. |
| **B4** | **Sources read at their canonical homes** | `worldFact.goods` set-equals `Object.keys(GOODS_CATEGORIES)` (7); `worldFact.services` set-equals `Object.keys(INSTITUTION_SERVICES)` (285) **read from `src/data/institutionServices.js`, not the `tradeGoodsData.js` re-export**; `worldFact.resources` at `('port','coastal')` set-equals `getCompatibleResources('port','coastal').map(r => r.key)` — **exactly 33** — and is asserted to hold **no `.label` value**, which is what keeps a display string out of a fact pool. |
| **B5** | **Boundary: the resource gate is LIVE, not inherited** | `worldFact.resources` differs between two routes/terrains (`('port','coastal')` vs `('isolated','desert')`) — asserted as a non-empty symmetric difference, so the gate is proved to fire rather than returning one fixed list. Absent route/terrain falls back to `('road', null)` and still returns a non-empty frozen array. |
| **B6** | **Determinism across the combined set** | `rollFrom` on each of the seven returns the same value on repeat calls (`toBe`); roll 3 taken alone equals roll 3 taken in sequence (the reopen guarantee); different `entryId`s differ for at least one pool. ⭐ And the no-draw law re-asserted **across all eighteen pools**: with an ambient RNG active, fifty `rollFrom` calls leave the next ambient draw equal to the pre-recorded value. |
| **B7** | **⛔ THE DEITY DOCTRINE** | `deity` returns exactly the world's own pantheon ids for a three-deity world and `[]` for a world with none; a source scan finds **no premade deity-name array anywhere in the module** — faith is culture, never theology. Anchored by the populated case asserted first. |

**7 new + A2a's 8 = 15 across the two packets; 7 of ≤8 in this one.** ⛔ **No arm is written for
`worldFact.tradeAccess`** — it is BLOCKED, and an arm would be an instruction.

---

## 10. Verification commands

```sh
npx eslint src/domain/edit/pools.js tests/domain/editPools.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editPools.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-A2b
npm run implementation:resume -- EM-A2b
```

Expected: every command exits `0`, **except** the named census interior red until the terminal.
⛔ Never read a gate through a shell pipe (§P7).

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: **the status is still BLOCKED** (R1
unruled); **EM-A2a has not landed** — this packet modifies its file; the seal is missing or
foreign; HEAD is not `d31af2cee` or a descendant proved non-interfering; **the COMBINED
`pools.js` measures > 250 effective lines** under eslint's own `Linter` with `skipBlankLines` and
`skipComments` → take the pre-declared **EM-A2c** split (the three `worldFact.resources|goods|
services` rows), **never squeeze**; a golden or the prose manifest moves by one byte; A6/B6 shows
the ambient sequence advancing; the leaf would need `namingData.js`, `npcGenerator.js`,
`rngContext.js` or any `.jsx` to satisfy an arm; a name pool's cross product would have to be
TRUNCATED to be usable (that is an EM-D2 affordance question, and truncating makes `rollFrom`
non-total); `pantheonStandings` no longer returns `[]` for an absent pantheon; any A2a row would
have to change.

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas, **with
the COMBINED `pools.js` figure measured by eslint's `Linter`** · acceptance B1–B7 plus A2a's A1–A8
re-run green · the measured largest name-pool cross product · focused commands, exits and counts ·
sealed per-step receipt and resume status · both typecheck configurations · gate stages actually
executed · base-versus-wave failure identity diff · dormancy/golden result · the ambient-stream
no-draw proof across all eighteen pools · census tuple before and at the tip with the interior red
quoted verbatim · generated artifacts `NONE` · deviations `NONE | STOP` · out-of-scope
observations without investigation (including `mountain_pass` and the first-paint question of R2) ·
**judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | ⛔⛔ **THE BLOCK (§2). `worldFact.tradeAccess` has no canonical exported option list, and the wizard's six disagree with the generator's five (`mountain_pass`).** Ruling (5)'s "name it by symbol, never a second copy" cannot be executed. Two paths costed at §2: **U1** mint `TRADE_ROUTE_OPTIONS` in `resolveConfig.js` and re-point the wizard (its own small member), or **U2** rule the pool the generator's five and record `mountain_pass` as wizard-only. **The packet is DRAFT the moment this is ruled.** |
| **R2** | **Unmeasured by this lane:** whether `src/data/tradeGoodsData.js` and `src/data/institutionServices.js` are already inside the eager first-paint closure. The packet imports them statically; if either is lazy today, this adds a first-paint edge. An unmeasured path is not a verified fact — the implementer measures it at preflight, or a pre-proof lane does. |
| **R3** | **The combined `pools.js` estimates ≈244 of 250** across A2a + A2b. **EM-A2c** (the three route/terrain-gated world-fact rows) is pre-declared at §3 as the next split. Ratify the contingency, or direct a different line now. |
| **R4** | **`worldFact.services` would be a 285-value pool.** That is the vocabulary's true size, not an error, but it is a drop-down question for EM-D2's `PoolField` (search rather than a menu). Recorded, not investigated. |
