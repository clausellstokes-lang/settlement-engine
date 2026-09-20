# Settlement editor / EM-A2 — the pool catalogue: ten typed pool ids resolved from the GENERATOR's own catalogues, and one seeded roller that draws on its own stream

- **Status:** SUPERSEDED
  ⛔ **SUPERSEDED BY EM-A2a (machinery + the eleven TABLE pools) and EM-A2b (the seven WORLD-DERIVED pools; BLOCKED on `worldFact.tradeAccess`).**
  Reason: the chair's ruling (5) added nine pools — the world-facts sets and design §15's two state vocabularies — taking the leaf over the 250 cap, so the pre-declared A2a/A2b split was used.
  Retained UNEDITED below as the compile record — its measurements, refutations and
  evidence are cited verbatim by the successors and remain valid at the same base.
  ⚠ DO NOT PROMOTE THIS FILE.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠⚠ **THE BASE MOVED UNDER THIS LANE TWICE DURING COMPILE AND BOTH MOVES ARE PROVED HARMLESS.**
  At 11:01:32 EDT `git -C $SP/consist rev-parse HEAD` printed `d31af2cee`; at 11:06:09 EDT,
  `02968876b`; at 11:17:13 EDT, `a03ebb09a17e0a96c1d6261a41257430bb7fbd32`. The whole window is
  **five commits touching six files** — four docs (`EM-PREAMBLE.md`, the design, the ARCH, the
  charter) plus `.gitignore` and `tests/build/generationWorkerLazy.test.js` (an EDIT to an
  existing test file, so the census `files` count cannot move for it). `d31af2cee` **IS an
  ancestor** of `a03ebb09a`, and **all twenty-three paths this packet measured are blob-identical
  across the full window** — including `tests/lint/.lighting-census-baseline.json`, whose tuple is
  unmoved (executed, `EM-A2.evidence.md` §0). This is `PACKET_STANDARD.md`'s base-state-capsule
  clause **J-T1**. The verified base is held at `d31af2cee` because that is the sha the brief
  pinned AND the sha the preamble names as its own signing base.
  **RAISED R0: the chair re-pins to `a03ebb09a` or confirms `d31af2cee`.**
- **Last revalidated:** 2026-09-19 11:17 EDT, `d31af2cee` (descendant `a03ebb09a` proved
  non-interfering: every measured path blob-identical)
- **Depends on:** `EM-A1` (declarations) — a `pool` field's declaration names a pool id and the
  declaration walker asserts membership of `POOLS`. **Not landed; a packet ID, not a SHA.**
  ⚠ The dependency is ONE-WAY and NAME-ONLY: this packet imports nothing from EM-A1 and its
  acceptance never reads a declaration. EM-A1 may land before or after; only the walker in
  EM-A1 couples them.
- **Collision group:** `NONE` against the registered manifest. **Measured by execution: all 182
  packets in `PACKET_MANIFEST.json` are TERMINAL** (`LANDED` or `SUPERSEDED` — the only two
  statuses present), so **no path anywhere is reserved non-terminally** and this packet's two
  CREATE paths have zero holders of any status (evidence §7).
  ⚠ **THE LIVE COLLISION IS WITH THE EM SIBLINGS BEING COMPILED RIGHT NOW, NOT WITH THE MANIFEST.**
  `tests/lint/sovereigntyLightingContract.walker.test.js` (89 terminal holders today) is claimed by
  every wave-1 EM member that adds a test file the moment they enter at DRAFT — and **DRAFT
  reserves exactly as READY does**. Under the train that row is the TERMINAL's, never a member's
  (preamble §P3.2); see §7's deferral box.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: `getInstitutionsForTier('town')` →
  a `Set` of 85; `getInstitutionalCatalog('town')` → 10 categories / 85 rows; `NAMING_DATA`
  11 cultures all name-complete; `RESOURCE_DATA` 33 keys + `SPECIAL_RESOURCES` 6;
  `FACTION_ARCHETYPES` 13 values; `TIER_ORDER` 6; the lighting census tuple
  `2645 / 383 / 2262 / 25009 / 6670` read from `tests/lint/.lighting-census-baseline.json`.
  No test was run by this lane (compile lanes run no gate).
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
  ⓘ The lane measured it TWICE, because it moved: `481dab28…` at `02968876b`, and
  **`398e562b125edbf61cd9fcfa855c219411fa738af1a8047bb307cc1e60558abb`** at `a03ebb09a` after the
  §934.43 phantom-consequence amendment (`shasum -a 256`, evidence §0). The chair stamps the
  second. ⚠ This is the preamble's own mechanism working as designed — an edit re-stamps every
  citing packet — and it is why no member may carry a hash it measured before the chair's last
  preamble commit.

---

## 1. Reconciled authority

1. **ODQ §934.42** — "Actually pause this and build the editor": the editor is built now, from
   `docs/implementation/charters/EDIT-MODE-TRAIN.md`, with the consist tip standing in for master.
2. **THE PROMISE** (constitutional) and the **deity doctrine** — a seed is a starting world
   forever; faith is culture and never theology, so there is no premade deity pool.
3. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §12 — GOVERNS.** §12.7: pools read the GENERATOR's
   catalogue (`getInstitutionalCatalog` / `getInstitutionsForTier`, tier-gated), never the display
   seams behind `institutionDisplayName` / `resourceDisplayName`, which are relabeling maps that
   pass unknowns through. §12.3: names are join keys.
4. **`docs/implementation/preambles/EM-PREAMBLE.md`** §P2, §P3, §P4, §P5 (HZ-PRNG in particular),
   §P8 — the family law, cited by hash above and not restated.
5. **`docs/ARCH_EDIT_MODE_AND_DECREES.md`** §1 (the module map's exports), §2 (`PoolSource`),
   §9 (the initial catalogues).
6. **`docs/implementation/charters/EDIT-MODE-TRAIN.md`**, row **EM-A2**.
7. Live code at `d31af2cee` — which decides everything below and refutes three premises.

**Resolved contradictions (each measured; the measurement is in the evidence):**

- `rollFrom(poolId, world, seed, rollIndex)` (ARCH §1) **vs** "seeded from the settlement seed,
  the entry id and a roll counter" (design §11 · ARCH §7 · preamble §P5 HZ-PRNG · charter EM-A2)
  → **the seed composition GOVERNS** (design §12 outranks the ARCH; the preamble is the chair's
  signature on the key). ARCH §1's four-parameter spelling cannot express a key that contains
  `entryId`, so the parameter list is extended, not replaced: `rollFrom(poolId, world, seed, entryId, n)`.
  **RAISED R1.**
- "pools read the generator's catalogue" (§12.7) **vs** "institutions → the catalogue behind
  `institutionDisplayName`" (design §2.2, pre-§12) → **§12.7 governs**; §2.2's clause is dead.
- "names from the culture's generator" (charter) **vs** the measured tree → **REFUTED, and the
  refutation shapes the contract** (§2 "What live code refutes", finding F1).

The implementer does not read other documents to reinterpret this packet.

---

## 2. Outcome

**Observable result:** `src/domain/edit/pools.js` answers, for any pool id and any world, the
exact closed list of values that pool offers — always drawn from the engine's own catalogues at
their source — and `rollFrom` picks one deterministically from a stream that is a pure function
of the settlement seed, the entry id and the roll index, touching no world draw.

**Definition of done:** `POOLS` holds exactly the ten pool ids of §6; `poolValues` returns a
frozen, codepoint-sorted, duplicate-free `string[]` (never `null`, never `undefined`) for every
id and a frozen empty array for a world that has nothing to offer; `rollFrom` returns a member of
that array or `null`; the acceptance file proves determinism, the tier gate, the no-draw law and
the doctrine; nothing imports this module (it lands DARK).

In scope:

1. **One primary behaviour:** the pool catalogue and its two readers (`poolValues`, `rollFrom`).
2. **One required integration:** NONE — wave 1 is headless and this leaf lands with zero
   production consumers (the first is EM-D2's `PoolField`, wave 4).
3. **One prevention guard:** the acceptance file's SOURCE-IDENTITY arm — every catalogue-backed
   pool is asserted to equal the generator's own live answer, so a future fork of a catalogue
   into this leaf reds rather than drifting.

Explicit non-goals:

- **EM-A1's** field declarations (`kind`, `group`, `pool` ids) and the declaration walker.
- **EM-A3's** flavor census.
- The `PoolField` control, "roll another" as a UI affordance, the compendium promotion valve.
- Any op, any guard, any registry entry, any persisted key.
- Any golden, tuning, migration, deployment or paid-surface behaviour.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

### What live code refutes — three findings, each measured, none blocking

**F1 — THERE IS NO CALLABLE "CULTURE NAME GENERATOR", AND CALLING THE ONE THAT EXISTS WOULD
BREAK HZ-PRNG.** The charter's required symbol "the name generator's export" resolves, at this
base, to `generateSettlementName` (`src/generators/npcGenerator.js:1719`) — the only exported
name producer. Its body reads `_rng()`, which is `random` imported from
`src/kernel/rngContext.js:16`, the **ambient module-level ACTIVE-RNG context**. That context
**fails closed**: with no active seeded RNG it THROWS (`rngContext.js:70-80`), and with one
active it consumes a draw from **the world's own sequence**. The NPC name producer `pickFirst`
(`npcGenerator.js:240`) is not exported at all. So the charter's clause cannot be honoured
literally in either direction — the export throws outside the pipeline and steals a world draw
inside it, which preamble §P5 HZ-PRNG forbids by name.
**The cure is the estate's own precedent, not an invention.** `src/domain/npc/npcOps.js:218`
`instantNpc({ seed, namingData, … })` already does exactly this job in `src/domain`: it builds
its own stream with `createPRNG(\`instant-npc:${seed}\`)` and takes the culture's `NAMING_DATA`
entry **as a parameter** (`pickFromNaming(rng, cultureData, gender)`), so the leaf neither
imports the table nor touches the ambient context. EM-A2 copies that shape exactly. The pool
therefore reads the generator's name **DATA** (`src/data/namingData.js`, the generator's own
source table) and rolls on its own stream. **RAISED R2.**

**F2 — "STANCES → THE RELATIONSHIP KINDS" NAMES TWO LIVE VOCABULARIES.**
`RELATIONSHIP_KIND_ORDER` (`src/domain/dossier/powerStrata.js:178`, six values —
`corrupted, competitive, tense, subordinate, dependent, symbiotic`) is the INTRA-settlement
faction-to-faction kind set; `PRIMARY_RELATIONSHIP_TYPES`
(`src/domain/worldPulse/relationshipCompatibility.js:41`, nine values beginning
`neutral, trade_partner, allied, patron, client, vassal, rival, cold_war`) is the
INTER-settlement one. The charter's `stance` pool serves the **faction card** (ARCH §9: "faction
(name free-cascade; archetype pool; power via the totality guard; stance pool)"), which is
intra-settlement, so this packet binds `stance` to `RELATIONSHIP_KIND_ORDER` and states the
choice rather than assuming it. ⚠ `RELATIONSHIP_KIND_ORDER`'s own header says it is a
**PRESENTATION order**; the packet re-sorts it by codepoint for the pool and asserts set-equality
with the source, so the pool never inherits a presentation decision. **RAISED R3.**

**F3 — THE PREAMBLE'S §P2.1 CENSUS PREMISE IS REFUTED AT THIS BASE, AND THE OBLIGATION STILL
BINDS THROUGH A DIFFERENT DOOR.** §P2.1 reads "A new file under `src/domain/**` or
`src/components/**` moves the sovereignty-lighting census … an exact file count". Measured:
that walker's `files` figure is `TEST_FILES.length`
(`tests/lint/sovereigntyLightingContract.walker.test.js:612`), where
`TEST_FILES = walk(join(ROOT, 'tests')).filter(p => /\.test\.(js|jsx)$/.test(p))` (`:515-518`).
**It counts test files under `tests/`, and no file under `src/` moves it.** The census
nonetheless moves for this packet — by exactly `+1 file` — because the packet adds
`tests/domain/editPools.test.js`. The predicted delta in §7 is therefore driven by the TEST file,
not by the domain leaf, and it is stated that way so the next EM compiler does not predict a
delta for a `src/domain` leaf that adds no test. **RAISED R4 (preamble wording).**

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0` | ≤1 |
| Named state writers | `0` | ≤1 |
| Feature flags | `0` (wave 1 is headless) | ≤1 |
| User-facing surfaces | `0` | ≤1 |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | `1` (`pools.js`) | ≤2 |
| Existing logic-bearing production files modified | `0` | ≤3 |
| Additional registration-only files | `0` | ≤3 |
| Handwritten files total | `2` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≈145 (estimate)** | ≤400 |
| Effective lines per new leaf | **≈145 of 250 (estimate)** | ≤250 |
| Delta in a shared/hot file | `0` — names no hot file | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE`.

**HOT FILES: this packet names NONE.** All five rows of the standing list
(`EconomicsTab.jsx`, `OutputContainer.jsx`, `convergence.js`, `peaceTerms.js`,
`informationStatecraft.js`) are outside the change manifest, so no headroom measurement is owed.

⭐ **THE LINE ESTIMATE AND WHY IT IS NOT AT THE CAP.** The budget counts **effective** lines —
eslint `max-lines` with `skipBlankLines` and `skipComments` — so this leaf's substantial header
and per-pool rationale comments cost nothing. The estimate decomposes as: ten `POOLS` rows ≈ 40;
six reader functions (institution 6, npc.role 12, commodity 8, deity 4, name 10, four one-liners 8)
≈ 48; `poolValues` + normalization ≈ 20; `rollFrom` ≈ 18; absence/freeze helpers ≈ 15; imports ≈ 7.
It is an ESTIMATE over code that does not exist and is **re-measured with eslint's own `Linter`
at implementation**; crossing 250 is a STOP, not a renegotiation (§11).

⛔ **STOP AND SPLIT — NOT INVOKED, and the reason is recorded rather than assumed.** The charter's
EM-A2 row lists nine pool families, which reads like more than one behaviour family. It is not:
every one of the ten ids is the same behaviour — *resolve a closed value list from an existing
catalogue at its source, and pick from it deterministically* — differing only in which existing
module is read. No second writer, no second persisted family, no second stream. **Were the
estimate to exceed 250 at implementation, the smallest split is pre-declared here so no lane has
to invent one under pressure:** `EM-A2a` keeps `POOLS`, `poolValues`, `rollFrom` and the six
closed-vocabulary pools (`institution.class`, `faction.archetype`, `stance`, `cause.remove`,
`commodity`, `tier`); `EM-A2b` adds the four world-derived pools
(`name.settlement`, `name.npc`, `npc.role`, `deity`), which are the only rows that read a
settlement rather than a table. The split line is exactly "table vs world", and it is
collision-disjoint in everything but the one leaf.

---

## 4. Sealed dispatch and preflight

Run from the packet's worktree before any edit:

```sh
npm run implementation:dispatch -- EM-A2
```

Expected:

- exact packet Markdown and structured capsule are emitted;
- verified-base ancestry and unchanged declared substrate are proven before the seal pins exact HEAD;
- **CREATE targets ABSENT** — `src/domain/edit/pools.js` and `tests/domain/editPools.test.js` must
  not exist (measured absent at this base, evidence §7); there are no non-CREATE production targets;
- every `requiredSymbols` row resolves in the live tree;
- Git-visible foreign dirt is fingerprinted without target overlap.

⚠ **THIS WORKTREE IS SHARED AND THE BASE HAS ALREADY MOVED ONCE (see the header).** Re-read
`git rev-parse HEAD` in the same command as the dispatch; a descendant is admissible only on the
docs-only-with-byte-identical-measured-paths clause, proved by execution, never assumed.

Any mismatch makes this packet STALE. Stop before coding.

---

## 5. Verified tree contract

Every row was found BY SYMBOL at `d31af2cee`; line numbers are hints only, and the proving
command for each is in `EM-A2.evidence.md`.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Tier-gated catalogue (names) | `src/generators/lookups.js` | `getInstitutionsForTier` | Takes one `tier`; returns a **`Set`** (executed: `getInstitutionsForTier('town')` → `Set`, size **85**). Metropolis reads `['city','metropolis']`; every row passes `institutionAvailableAtTier`, i.e. the `minTier` gate | The ONLY source of `institution.class` values. Convert to array and sort; never mutate the Set |
| Tier-gated catalogue (shape) | `src/generators/lookups.js` | `getInstitutionalCatalog` | Returns `Record<category, Record<name, CatalogRow>>` (executed at `'town'`: **10** categories, **85** rows — name-for-name equal to the Set above). `'random'`/`'custom'`/absent → the village block; `'all'` is ungated by design | The source when the pool needs the CATEGORY grouping. Never re-implement the gate |
| Tier gate | `src/generators/lookups.js` | `institutionAvailableAtTier` | `(def, tier) => !def?.minTier \|\| tierAtLeast(tier, def.minTier)` — the generator's own test, written the same way round | Reuse; the pool never writes a second gate |
| FORBIDDEN display seam | `src/domain/display/resourceDisplayName.js` | `resourceDisplayName` | A relabeling map over `RESOURCE_DISPLAY_LABELS` that **passes unknowns through** (`:130`) | ⛔ NEVER a pool source (§12.7). Same for `institutionDisplayName` |
| Name DATA | `src/data/namingData.js` | `NAMING_DATA` | The generator's own table. Executed: **11** culture keys, **all 11** name-complete (`maleNames`,`femaleNames`,`surnames`); `settlementPrefixes`/`settlementSuffixes` per culture. 4,038 lines / ~68.6 kB | The pool's name source, passed IN by the caller — never imported at module scope (F1, §6 "Bundle law") |
| Name-roll precedent | `src/domain/npc/npcOps.js` | `instantNpc`, `pickFromNaming` | `createPRNG(\`instant-npc:${seed}\`)` — a ROOT composition, not a fork; `pickFromNaming(rng, cultureData, gender)` takes the culture bag as a PARAMETER | **Copy this shape exactly.** It is the estate's answer to F1 |
| ⛔ AMBIENT RNG — the thing to avoid | `src/kernel/rngContext.js` | `random`, `_roll` | Module-level `_activeRng`; **fails closed** — THROWS with no active RNG (`:70-80`), consumes a WORLD draw with one | ⛔ `pools.js` imports NOTHING from this module. HZ-PRNG |
| PRNG kernel | `src/kernel/prng.js` | `createPRNG` | `createPRNG(seed)` → `{ seed, random, pick, chance, randInt, shuffle, weightedPick, fork, randFloat }`. `pick(arr)` returns **`undefined`** on an empty/absent array (`:33-36`) | The ONLY stream source. ⚠ NOT at `src/generators/kernel/prng.js` — that path does not exist |
| ⛔ Fork-label law | `src/kernel/prng.js` | `fork` | `fork(label) => createPRNG(\`${seed}::${label}\`)`. The `::` delimiter is load-bearing vocabulary; `tests/kernel/prngForkLabelDelimiter.test.js` freezes the embedded-delimiter families and RESERVES the head `epoch` | ⛔ `rollFrom` calls `fork` **never**, and its key contains no `::` — so neither register can move (§6) |
| Archetype table | `src/domain/factionArchetypes.js` | `FACTION_ARCHETYPES` | A frozen 13-value map (executed: `government, noble, military, merchant, religious, criminal, arcane, craft, labor, outsider, occupation, civic, other`) | The ONLY source of `faction.archetype` |
| Stance vocabulary | `src/domain/dossier/powerStrata.js` | `RELATIONSHIP_KIND_ORDER` | Frozen six: `corrupted, competitive, tense, subordinate, dependent, symbiotic`. Its header declares itself a PRESENTATION order | The source of `stance` (F2). Re-sorted by codepoint; set-equality asserted |
| Resource catalogue | `src/data/resourceData.js` | `RESOURCE_DATA`, `SPECIAL_RESOURCES` | Executed: **33** and **6** keys. Each `RESOURCE_DATA` row carries a `commodities: string[]` | The source of `commodity`, read at its source. ⚠ Eager first-paint chunk (§6 "Bundle law") |
| Pantheon reader | `src/domain/display/pantheonDepth.js` | `pantheonStandings` | `(worldState) => Array<{ id, seats, wins, losses, tier, fromMajor }>`, sorted by descending seats then codepoint id; **`[]` when dormant or absent** (`:100`) | The ONLY source of `deity`. The WORLD's pantheon — never a premade list (deity doctrine) |
| Tier ladder | `src/data/constants.js` | `TIER_ORDER` | `['thorp','hamlet','village','town','city','metropolis']` — six, ordered small→large | The source of `tier`. ⚠ Its order is MEANING; see §6 ordering |
| Stable order | `src/domain/deterministicSort.js` | `compareCodepoint` | `(a,b) => String(a ?? '') < String(b ?? '') ? -1 : … ` — the estate's one sanctioned string order | Every pool's enumeration order, except `tier` |
| Test precedent | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q — the institution founding year')` + its **seven straight-line `it`** titles | One literal `describe`, straight-line `it`, no `.each`/`runIf`/nesting; positive control first | **Copy this proof shape.** Required by preamble §P3.4 |
| Test precedent (tables) | `tests/domain/undercityStrataExistence.test.js` | `MF-UC0`'s A1 ("300+ rows walked … as one table") | A single `it` may walk a table and report a FULL offender list, never a first failure | Copy for the ten-pool table arms |

**Forbidden alternatives:**

- no second catalogue, vocabulary, tier gate, PRNG stream, time source or writer;
- no import of `src/kernel/rngContext.js`, `src/generators/npcGenerator.js`,
  `src/domain/display/institutionDisplayName.js` or `src/domain/display/resourceDisplayName.js`;
- no import of anything under `src/components/**` (preamble §P4);
- no new top-level `worldState` key; this packet persists nothing;
- no edit to `src/generators/lookups.js`, `src/data/namingData.js`, `src/data/resourceData.js`,
  `src/domain/factionArchetypes.js` or any other existing file — **this packet modifies ZERO
  existing production files**;
- no files outside the manifest.

---

## 6. Exact contracts

### Inputs and outputs

```js
/**
 * @typedef {{ tier?: string, institutions?: Array<{name?: string, role?: string}>,
 *   pantheon?: object, namingData?: object, culture?: string }} PoolWorld
 *   The read bag. Every field is OPTIONAL and every absence is answered with [].
 */

/** The closed registry. Frozen. Exactly the ten ids below, no more, no fewer. */
export const POOLS;              // Readonly<Record<string, PoolSource>>

/**
 * The pool's values for this world, as a FROZEN array of strings.
 * @param {string} poolId
 * @param {PoolWorld|null|undefined} world
 * @returns {readonly string[]}   ALWAYS an array. Never null, never undefined, never throws.
 *                                An unknown poolId returns the frozen empty array.
 */
export function poolValues(poolId, world);

/**
 * One deterministic pick from that pool.
 * @param {string} poolId
 * @param {PoolWorld|null|undefined} world
 * @param {string|number} seed     the SETTLEMENT seed
 * @param {string} entryId         the registry entry / field identity the roll belongs to
 * @param {number} n               the roll counter, an integer >= 0
 * @returns {string|null}          a member of poolValues(poolId, world), or null when that
 *                                 array is empty. NEVER undefined.
 */
export function rollFrom(poolId, world, seed, entryId, n);
```

### The ten pool ids — exact, closed, and their exact sources

| id | source kind | exact read | values at this base |
|---|---|---|---|
| `institution.class` | `catalogue` | `[...getInstitutionsForTier(world?.tier ?? 'village')]` | 85 at `town` |
| `name.settlement` | `generator` | `world.namingData[culture].settlementPrefixes` × `settlementSuffixes`, concatenated | per culture |
| `name.npc` | `generator` | `world.namingData[culture]` `maleNames`+`femaleNames`, then ` ` + `surnames` | per culture |
| `npc.role` | `world` | the distinct non-empty `role` of `world.institutions[]`, plus each institution's `name` where `role` is absent | world-derived |
| `faction.archetype` | `catalogue` | `Object.values(FACTION_ARCHETYPES)` | 13 |
| `stance` | `catalogue` | `RELATIONSHIP_KIND_ORDER` | 6 |
| `cause.remove` | `literal` | frozen `['burned','died','dissolved','left','seized']` | 5 |
| `commodity` | `catalogue` | every `RESOURCE_DATA[k].commodities[]` flattened, plus `Object.keys(SPECIAL_RESOURCES)` | 33 rows + 6 |
| `deity` | `world` | `pantheonStandings(world).map(e => e.id)` | world-derived; `[]` when dormant |
| `tier` | `catalogue` | `TIER_ORDER` | 6 |

⛔ **`cause.remove`'s five values are the owner's own list** (ODQ §934.36 addendum, "died, left,
burned, dissolved, seized"). They are stored as a frozen literal in codepoint order; changing
the MEMBERSHIP is an owner act, changing the ORDER is not.

### State schema

**NONE.** This packet persists nothing, writes nothing, and mints no state. `POOLS` is a frozen
module constant; `poolValues` and `rollFrom` are pure functions of their arguments.

Absence rules:

- **absent** (`world` is `null`/`undefined`, or the field it needs is missing): the pool returns
  the **frozen empty array**. Never a throw, never a default world, never an invented value.
- **empty** (`[]`): a legal, meaningful answer — "this world offers nothing here". It is NOT an
  error and NOT distinguished from absence: `poolValues` collapses both, deliberately, because a
  caller that must branch on the difference would be branching on world shape, not on content.
- **`null`**: forbidden as a `poolValues` return. It IS the `rollFrom` return for an empty pool.
- **invalid legacy input** (a non-string member, a duplicate, a blank): dropped during
  normalization — `String(v)`, trim, drop `''`, dedupe — never repaired, never thrown on.
- **unknown `poolId`**: the frozen empty array. `poolValues` never throws; membership of `POOLS`
  is EM-A1's walker's business, not a runtime failure.

### Transition table

Not applicable: this packet has no state and no transitions. The row is omitted rather than
filled with a restatement of the read contract.

### Ordering and precedence

- **Pipeline/tick position:** NONE. This leaf is outside generation and outside the pulse; it is
  never called during a seeded run.
- **Same-tick visibility:** not applicable.
- **Merge/replace/deduplicate:** values are de-duplicated after normalization, first occurrence
  kept — which is order-independent because the sort follows.
- **Stable enumeration:** every pool is sorted with `compareCodepoint` **except `tier`**, whose
  `TIER_ORDER` sequence is semantic (small→large) and is preserved verbatim. That exception is
  stated here so it can be refused; it is asserted in acceptance A4.
- **Tie-break:** `compareCodepoint` is total over distinct strings, and duplicates are already
  gone, so no tie can occur.

### Determinism

- **Hash/fork key — the EXACT spelling, and it is a ROOT composition, never a fork:**

  ```js
  createPRNG(`edit-pool:${poolId}:${String(seed)}:${entryId}:${n}`)
  ```

  Then one `.pick(values)`.

  ⭐ **Why a root composition and not `.fork()`.** `fork(label)` derives `` `${seed}::${label}` ``
  and the `::` delimiter is load-bearing vocabulary frozen by
  `tests/kernel/prngForkLabelDelimiter.test.js`, which pins the embedded-delimiter families and
  RESERVES the head `epoch`. A root composition with single-colon separators touches neither
  register, so **that walker cannot move for this packet** — and `instantNpc` already does exactly
  this (`createPRNG(\`instant-npc:${seed}\`)`). The head token is `edit-pool`, which is not `epoch`.
- **`n` is IN the key, not a number of advances.** Roll `n` is therefore reproducible without
  replaying rolls `0..n-1`, so reopening a card at roll 3 reproduces roll 3 exactly (design §11:
  "reopening a card reproduces its rolls"). Advancing a single stream would make roll 3 depend on
  whether rolls 0–2 were ever taken, which reopening does not do.
- **Rounding/clamping:** none. No float is produced, stored or rendered, so prose-numerics is not
  engaged (preamble §P2.7).
- **No-draw behaviour — the load-bearing one:** `rollFrom` **consumes no world draw and no
  ambient draw**. It never imports `src/kernel/rngContext.js`, never calls `getActiveRng`,
  `setActiveRng`, `random`, `pick`, `chance`, `randInt`, `shuffle` or `weightedPick` from that
  module, and never calls `Math.random`, `Date.now` or any locale-sensitive comparator. Called
  inside an active seeded generation it leaves `_activeRng`'s sequence position **unchanged**;
  called outside one it does not throw. A4/A6 assert both halves by execution.

### Bundle law — the measured constraint that shapes the name pool

⛔ **`pools.js` imports NO large data table at module scope.** Two measurements force it:
`src/data/namingData.js` is 4,038 lines / ~68.6 kB and
`src/domain/townCartography/cartographyWards.js:19-21` records the estate refusing that exact
import into a bounded leaf for that exact reason; and `src/data/resourceData.js` sits in the
**eager first-paint `data` chunk**, whose surface law is stated verbatim at
`src/data/goods/identity.js` ("one such line silently moves ~390 kB … and blows the
1,040,000-byte budget", enforced by `tests/build/vendorPdfLazy.test.js`). `pools.js` is destined
for the first-paint graph via `src/store/editSlice.js` (EM-C4).

**So:** `name.settlement` and `name.npc` read `world.namingData` — **passed in by the caller**,
exactly as `instantNpc` takes `namingData` — and `pools.js` imports `NAMING_DATA` never.
`commodity` reads `RESOURCE_DATA`/`SPECIAL_RESOURCES` by static import, which is admissible
because that module is ALREADY in the eager closure (three first-paint modules reach it) and adds
no new edge. A7 asserts the import list by source scan in both directions.

### Flag and dormancy

- **Flag:** `NONE`. Wave 1 is headless (charter; preamble §P2). The editor's gate is
  `TIER_GATE.premium.editMode` and it is **EM-D1's**, minted at the surface, never here.
- **Absent / False / True:** not applicable — there is no flag to read.
- **Dormancy:** this leaf lands with **zero importers**. A6 proves it by a source scan.
- **Golden posture:** `UNCHANGED`. `tests/property/generatorGoldenMaster.test.js` (525 rows) and
  `tests/property/dossierProseManifest.test.js` must not move by one byte. The claim is
  structural, not argued: generation cannot reach a module nothing imports, and the leaf takes no
  ambient draw, so no seeded stream shifts. A6 executes the reachability half. **Motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Module constant, frozen at load | `poolValues` / `rollFrom`, pure | **Never** — nothing here is persisted | n/a | Pools are re-read from the live catalogues every call, so a regenerated world yields the regenerated world's values | n/a | **Nothing to migrate** — no stored shape is minted | **Nothing to veil** — no secret is read; `pantheonStandings` reads public world standings only |

⚠ **The whole lifecycle row is "nothing", and that is a verified claim, not an omission.** This
leaf reads catalogues and a world bag and returns strings. It is the only wave-1 member with no
persistence surface at all, which is why it owes no observed-shape door (§7).

### Receipts and privacy

- **Closed kinds:** `NONE` — this packet emits no receipt.
- **Address chain:** not applicable.
- **Numeric-to-word bands:** not applicable; no figure is rendered.
- **DM-only fields:** `NONE`.
- **Player/public projection:** `NONE` — nothing produced here is persisted or projected, so no
  denylist, `publicSafe` or `worldSnapshotPublic` row is owed (those are **EM-B3's**, preamble §P2.6).

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: this leaf offers values; it takes no side and reads no alignment
  axis. The deity pool returns the world's own pantheon IDS and reads no alignment, law or temper
  field — the deity doctrine's line is that faith is culture, and a pool that ranked deities would
  cross it.`
- **Edit story:** `ENGINE-ONLY: the DM's verb is EM-D2's PoolField; this packet is the pure
  catalogue underneath it and has no surface, no proposal path and no DM-facing behaviour.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/pools.js` | `POOLS`, `poolValues`, `rollFrom` | **250 eff (cap); ≈145 estimated** | The pool catalogue of §6, exactly ten ids. Every catalogue-backed pool reads its source module directly; the two name pools read `world.namingData`; `deity` reads `pantheonStandings`. `rollFrom` builds its own root-composed stream. Import nothing from `src/kernel/rngContext.js`, `src/components/**` or `src/data/namingData.js`. |
| `CREATE` | `tests/domain/editPools.test.js` | A1–A8 | `n/a` | ONE literal `describe`, **eight straight-line `it`** titles, no `.each`, no `runIf`, no nested `describe` (preamble §P3.4). Table-driven arms report a FULL offender list, never a first failure (the MF-UC0 shape). Every negative carries its `// anchored:` marker on the line immediately above it. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` tuple in `tests/lint/.lighting-census-baseline.json` | `n/a` | ⛔ **DEFERRED TO THE TRAIN TERMINAL — the member does NOT edit this file and does NOT claim the path.** See the deferral box below. |

Generated artifacts: `NONE`.

⛔ **EDGE-SHARED BUNDLE CLOSURE: NOT OWED, and that is a measurement.** The obligation triggers on
membership of a closure whose entry modules are named in `scripts/build-edge-shared.mjs`. This
packet MODIFIES zero existing files, so no closure input moves and no bundle can go stale. The
question is resolved at compile, as `PACKET_STANDARD.md` requires, rather than at the gate.

No other file may be edited.

### The registration ledger — every obligation priced, including the four that are NOT owed

| # | Obligation | Verdict | The measurement |
|---|---|---|---|
| P2.1 | sovereignty-lighting census | **OWED — `+1 file`, an INTERIOR RED** | The walker's `files` is `TEST_FILES.length` over `tests/**/*.test.js` (`:515`, `:612`), so the driver is `tests/domain/editPools.test.js`, **not** the `src/domain` leaf (finding F3). Predicted delta `+1 files / +0 parked / +1 credited / +8 titles / +1 suiteTitles` from the base tuple `2645 / 383 / 2262 / 25009 / 6670`. Re-derived whole at the terminal (preamble §P3.2); **the member names the red in advance and never patches the tuple.** |
| P2.2 | `scripts/mutation-coverage-manifest.json` row | **NOT OWED** | The obligation attaches to a new file under the ENFORCER DIRS, of which `tests/lint` is the first (`tests/lint/mutationCoverage.shared.mjs:36-37`). This packet's only test file is `tests/domain/editPools.test.js`. Executed: `tests/domain/` is not an enforcer dir. |
| P2.3 | observed-shape `EXPLAINED_WRITER_EXEMPTIONS` | **NOT OWED** | The door is for a new domain reader of a **save-time key** (`dmLayer`, `decrees`). This packet reads neither; it persists nothing and mints no stored shape. `scripts/check-observed-shape-readers.mjs` scans every `.js`/`.jsx` under `src/` (`:250`), so `pools.js` IS scanned — and a leaf that reads only catalogue tables and an explicitly-passed world bag adds no corpus-less reader. **The chair still runs `node scripts/check-observed-shape-readers.mjs` plain at the member's tip; motion there is a STOP, not a cure.** |
| P2.4 | `scripts/check-writer-reach.mjs` | **CANNOT MOVE — measured** | `SURFACE_CLOSURE_STOP` (`scripts/lib/writer-reach-scan.mjs:115-117`) includes **`'src/store/'`**. `src/domain/edit/pools.js` reaches a surface only through `src/store/editSlice.js` (EM-C4, wave 2), and the closure halts at the store, so no surface closure can reach this leaf. Neither a shrink (`--write`) nor a mint is owed, in this packet or in EM-C4. |
| P2.5 | decision-fork classification row + mechanism-coverage baseline row for the `rollFrom` pool mint | **NOT OWED — measured, not assumed** | The decision-fork walker is `tests/lint/chooserTotality.walker.test.js`, whose `SCAN_ROOTS` are exactly `src/domain/worldPulse`, `src/domain/spatial`, `src/domain/traditions`, `src/domain/region` (`:64-69`) — **`src/domain/edit` is not among them**, so the register (`src/domain/worldPulse/habitForkRegistry.js`) has no row shape for this leaf. The mechanism-coverage walker enumerates `src/domain/worldPulse` modules (`scripts/soak/flagConstraints.mjs:27-29`); `pools.js` is not one and lights no worldPulse mechanism. **This is the same verdict `flagConstraints.mjs` itself recorded for §85.4 — "NOT OWED, and that is a measurement, not an assumption".** ⚠ **RAISED R5:** the chair may prefer the roots to GROW to cover `src/domain/edit`; that is a register act, not this member's. |
| P2.7 | prose-numerics | **NOT OWED** | No figure is rendered; no float is produced. |

> ⛔ **THE SHARED CENSUS ROW IS DEFERRED (the §417 / MF-T2Q shape).** Every wave-1 EM member that
> adds a test file owes the same walker re-record, and `scripts/implementation-packets.mjs`
> refuses one `changeManifest` path claimed by more than one NON-TERMINAL packet — **DRAFT
> reserves exactly as READY does.** This member therefore claims the path in the table above with
> the action `TEST` and the instruction "deferred", makes **no edit**, and hands the chair the
> exact row text for the landing act:
>
> ```json
>         {
>           "action": "TEST",
>           "path": "tests/lint/sovereigntyLightingContract.walker.test.js"
>         }
> ```
>
> ⚠ **INTERIOR RED, NAMED IN ADVANCE (preamble §P2.1, train law).** Until the census is re-derived
> whole at the terminal, `tests/lint/sovereigntyLightingContract.walker.test.js` reds at this
> member's tip with the message shape
> `the estate's file count moved — re-measure, do not re-word: expected 2646 to be 2645`.
> ⭐ **This row must NOT appear in `EM-A2.manifest.json` while a sibling holds it non-terminally.**
> The manifest emitted beside this packet therefore **omits it** and the chair inserts it once, at
> the terminal, for whichever member the train's plan assigns it to.

---

## 8. Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch, and re-read `git rev-parse HEAD`
   in the same command (the base has moved once already).
1. Capture the baseline: the five census figures from `tests/lint/.lighting-census-baseline.json`;
   `sha256` of `tests/fixtures/generator-golden-master.json` **before any edit** (the dormancy
   control, re-taken at the tip — it must be identical).
2. Add `tests/domain/editPools.test.js` with A1–A8 **failing**.
3. Implement `src/domain/edit/pools.js`: first `rollFrom`'s stream and the normalizer, then the
   six closed-vocabulary pools, then the four world-derived pools, then `POOLS` and `poolValues`.
4. Extend the sole writer / lifecycle seam: **NOT APPLICABLE** — this packet has no writer and no
   lifecycle seam. Skip step 4 and record that it was skipped.
5. Wire consumers: **NOT APPLICABLE** — the leaf lands DARK with zero importers. Skip step 5 and
   record that it was skipped.
6. Registrations and the prevention guard: no registry row is owed (§7's ledger); the prevention
   guard is A7, inside the acceptance file.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan and write the completion receipt.

Bounded algorithm — `rollFrom`:

```text
1. values = poolValues(poolId, world)                       // frozen, sorted, deduped
2. if values.length === 0 -> return null                    // NOT undefined; the typed absence
3. if !Number.isInteger(n) || n < 0 -> n = 0                // clamp the counter, never throw
4. rng = createPRNG(`edit-pool:${poolId}:${String(seed)}:${entryId}:${n}`)
5. picked = rng.pick(values)                                // exactly one draw on OUR stream
6. return picked === undefined ? null : picked              // step 2 makes this unreachable;
                                                            // kept because pick's contract is
                                                            // `undefined` and the return type is
                                                            // `string|null`
```

Bounded algorithm — `poolValues`:

```text
1. src = POOLS[poolId]; if !src -> return EMPTY (the one frozen [])
2. raw = src.values ?? src.read(world ?? {})                // read never throws on {}
3. if !Array.isArray(raw) -> return EMPTY
4. normalize: String(v) -> trim -> drop '' -> dedupe, first occurrence kept
5. if poolId === 'tier' -> keep TIER_ORDER's sequence      // the ONE stated exception
   else                 -> sort with compareCodepoint
6. return Object.freeze(result)
```

---

## 9. Acceptance matrix

`tests/domain/editPools.test.js`, one literal `describe`, eight straight-line `it`.

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| **A1** | **Main behaviour + GUARD-THE-GUARD, first** | A real `town` world | `POOLS` holds exactly the ten ids of §6 (set-equal both directions, a full offender list on failure). Every pool returns a frozen, non-empty, duplicate-free `string[]` — asserted BEFORE any negative below, so no later arm can pass on nothing. `institution.class` at `town` is exactly **85** values and **set-equals `[...getInstitutionsForTier('town')]`**; `faction.archetype` set-equals `Object.values(FACTION_ARCHETYPES)` (13); `stance` set-equals `RELATIONSHIP_KIND_ORDER` (6); `tier` equals `TIER_ORDER` (6). | `tests/domain/editPools.test.js` |
| **A2** | **Absence is the typed value, and nothing throws** | `null`, `undefined`, `{}`, `{ tier: 'nonsense' }`, `{ institutions: null }`, `{ pantheon: 'garbage' }`, an unknown pool id | Every call returns a **frozen array** — never `null`, never `undefined`, never a throw — and `rollFrom` returns **`null`** for each empty pool. An unknown pool id returns `[]`. A `tier` of `'random'`, `'custom'` or absent yields the VILLAGE catalogue (the `lookups.js` special case), not an empty pool — anchored against the `'nonsense'` case, which yields `[]`. | same |
| **A3** | **⛔ THE SOURCE-IDENTITY COUNTERFORCE — the display seams are NOT the source** | `institution.class` and `commodity` at three tiers | Each catalogue pool set-equals its GENERATOR source live, and a source scan proves `pools.js` imports **neither** `src/domain/display/institutionDisplayName.js` **nor** `src/domain/display/resourceDisplayName.js`. Non-vacuity: the matcher is proved to fire on a planted import string. ⭐ The tier gate is proved LIVE, not inherited — a row carrying `minTier: 'metropolis'` is absent from `institution.class` at `city` and present at `metropolis`. | same |
| **A4** | **Boundary: stable order, and the ONE stated exception** | all ten pools | Every pool except `tier` is in `compareCodepoint` order, asserted by re-sorting and comparing. `tier` is `TIER_ORDER`'s semantic sequence **verbatim** and is asserted NOT to be codepoint-sorted (`'city'` precedes `'hamlet'` in codepoint order but follows it here) — so the exception is pinned in both directions and cannot be silently "fixed". Duplicates planted in a world's `institutions[]` collapse to one `npc.role` value. | same |
| **A5** | **Idempotency and reopen-reproducibility** | one world, one seed, one `entryId` | `rollFrom(p, w, s, e, 3)` called three times returns the same value (`toBe`). Rolls `0..9` are taken in order, then roll `3` is taken **alone on a fresh call** and equals the earlier roll 3 — the reopen guarantee, which an advancing single stream would break. Different `entryId`s at the same `n` are proved to differ for at least one pool (non-vacuity on the key's `entryId` segment); the same for different `seed`s. | same |
| **A6** | **⛔ THE NO-DRAW LAW AND THE GOLDEN'S STRUCTURAL PROOF** | an active seeded RNG | With `setActiveRng(createPRNG('probe'))` live: record `getActiveRng().random()` twice to fix the sequence, then re-seed, call `rollFrom` **fifty times across all ten pools**, and assert the NEXT ambient draw equals the recorded second value — the ambient stream did not move by one step. With **no** active RNG, `rollFrom` does not throw (the fail-closed context is never reached). Plus the dormancy half: a source scan over `src/**` finds **zero** importers of `src/domain/edit/pools.js`, with a guard-the-guard arm proving the walk non-empty and the matcher live on a planted string. | same |
| **A7** | **THE IMPORT FENCE, both directions (the prevention guard)** | `pools.js` source | Its import list is asserted EXACTLY: it contains `src/kernel/prng.js`, `src/generators/lookups.js`, `src/domain/factionArchetypes.js`, `src/domain/dossier/powerStrata.js`, `src/data/resourceData.js`, `src/domain/display/pantheonDepth.js`, `src/data/constants.js`, `src/domain/deterministicSort.js` — and it contains **none of** `src/kernel/rngContext.js`, `src/data/namingData.js`, `src/generators/npcGenerator.js`, any `src/components/**` path, any `src/store/**` path. The import list is proved non-empty first. ⭐ This is the arm that keeps the 68.6 kB name table and the ambient RNG out by construction rather than by review. | same |
| **A8** | **⛔ THE DEITY DOCTRINE, AND THE NAME POOL'S PASSED-IN DATA** | a world with a three-deity `pantheon`; a world with none; a `namingData` bag for two cultures | `deity` returns exactly the world's own three ids and **`[]`** for the world with no pantheon — there is no premade deity list anywhere in the module, asserted by a source scan for a literal deity-name array. `name.settlement` and `name.npc` return values only when `world.namingData` is supplied, `[]` when it is absent, and their values are drawn from the SUPPLIED bag (a bag with one made-up prefix yields a name containing it) — proving the pool never reaches for the real table behind the caller's back. | same |

This table is the entire edge-case budget: **8 of ≤8**. Omit nothing; add nothing during
implementation. A newly discovered edge case goes in the receipt uninvestigated unless it
disproves a premise, in which case the packet STOPS.

---

## 10. Verification commands

```sh
# Focused static checks
npx eslint src/domain/edit/pools.js tests/domain/editPools.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict          # src/domain/edit/** must be strict-clean (preamble §P4)

# Focused tests — ONE test directory per gated run, the slot held for the whole process
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editPools.test.js

# The golden/dormancy proof — UNCHANGED is the required result
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

# The anchored-negative walker over the new file, and the PRNG register that must NOT move
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/kernel/prngForkLabelDelimiter.test.js

# The registers that must be verified plain at the tip
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-A2
npm run implementation:resume -- EM-A2

# Wave-end: the train's terminal runs the bare gate. A member never runs `npm run check`.
```

Expected: every command exits `0`, **except** the one inherited row named in §7 —
`tests/lint/sovereigntyLightingContract.walker.test.js`, which is a NAMED interior red at this
member's tip until the terminal re-derives the census. ⛔ Never read a gate through a shell pipe
(preamble §P7). Report actual counts; copy no historical count.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and preamble §P8, stop if:

- the dispatch seal is missing, invalid, or belongs to another worktree state;
- resume reports authority, HEAD, foreign-work or receipt-integrity drift;
- **HEAD is not `d31af2cee` or a descendant proved docs-only with every measured path
  blob-identical** — the base already moved once during compile;
- `src/domain/edit/pools.js` measures **> 250 effective lines** under eslint's own `Linter` with
  `skipBlankLines` and `skipComments` → take §3's pre-declared A2a/A2b split; never renegotiate;
- a golden or the prose manifest moves **by one byte**;
- `tests/kernel/prngForkLabelDelimiter.test.js` moves — it proves `rollFrom` reached for `fork`
  or spelled `::`, which is a different packet;
- the ambient-draw arm (A6) shows the sequence advancing — `rollFrom` has touched `rngContext`;
- `pools.js` would need to import `src/data/namingData.js`, `src/generators/npcGenerator.js` or
  `src/kernel/rngContext.js` to satisfy any arm;
- a pool would need a value the engine does not already hold (that value belongs in the
  compendium, which is the design's stated pressure valve, not in this leaf);
- `getInstitutionsForTier` is found to return anything but a `Set`, or to disagree with
  `getInstitutionalCatalog` name-for-name;
- any of R1–R5 is answered in a way that changes a contract above.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into
the next wave.

---

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (`pools.js` measured with eslint's `Linter`):
- Acceptance cases A1–A8, executed and passed:
- Focused commands, exits and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations (`typecheck:ratchet`, `typecheck:domain:strict`):
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result (the fixture digest, before and at the tip):
- The ambient-stream no-draw proof:
- Census tuple before and at the tip, with the interior red quoted verbatim:
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`

---

## 13. RAISED — questions only the chair can answer

| # | Item | For the chair |
|---|---|---|
| **R0** | **The base moved during compile** — `d31af2cee` → `02968876b`, one docs-only commit adding the EM preamble; `d31af2cee` is an ancestor and all eighteen measured paths are blob-identical. The packet holds `d31af2cee`. | Re-pin to `02968876b`, or confirm `d31af2cee`. |
| **R1** | **`rollFrom`'s signature.** ARCH §1 spells `rollFrom(poolId, world, seed, rollIndex)`, which cannot carry the `entryId` that design §11, ARCH §7, the charter and preamble §P5 all require in the key. The packet settles on `rollFrom(poolId, world, seed, entryId, n)` — ARCH §1's order, extended by one parameter, with `rollIndex` renamed `n` per the charter's own spelling. | Ratify, or direct a different spelling (e.g. an options bag). |
| **R2** | **The name generator premise is refuted (F1).** No exported, seedable culture name generator exists; the only export draws on the ambient fail-closed RNG context and would steal a world draw. The packet takes the `instantNpc` shape instead: read the generator's DATA, roll on our own stream, take the culture bag as a parameter. | Ratify the substitution, or rule that a seedable generator export is minted first (a different packet). |
| **R3** | **The `stance` pool's source (F2).** Two live vocabularies answer to "the relationship kinds". The packet binds `stance` to `RELATIONSHIP_KIND_ORDER` (intra-settlement, six) because the charter's stance pool serves the faction card. | Ratify, or bind it to `PRIMARY_RELATIONSHIP_TYPES`. |
| **R4** | **Preamble §P2.1's census premise is refuted (F3).** The walker's `files` counts `tests/**/*.test.js`, not files under `src/`. The obligation still binds here through the new test file. | Amend §P2.1's wording (a preamble edit re-stamps every EM member's hash), or record the correction in the train plan only. |
| **R5** | **The decision-fork and mechanism-coverage registers do not reach `src/domain/edit` (§7's ledger).** `chooserTotality`'s `SCAN_ROOTS` are four worldPulse-family dirs; the mechanism walker enumerates `src/domain/worldPulse`. So the editor's seeded chooser is registered nowhere. The packet records NOT OWED by measurement — but the gap is real. | Grow the roots to cover `src/domain/edit` (a register act, its own member), or accept the gap with the measurement on record. |
