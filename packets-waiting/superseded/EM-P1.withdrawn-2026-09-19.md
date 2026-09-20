# Settlement editor / EM-P1 — STABLE IDENTITY: every NPC, institution and faction gets a permanent id minted from its step's own stream, existing saves get theirs on first read, and the goldens re-record once

- **Status:** DRAFT
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19 11:4x EDT at `d31af2cee`; Wave 0 at `1d2da8c95`; **owner decision §934.47 A read as DECIDED YES at `799074c99`**. J-T1 window in `EM-B2.evidence.md` §E0/§E12/§E14
- **Depends on:** `NONE` structurally. ⚠ It should land AFTER `EM-P0`: both re-prove the same 525-row golden, and P0's proof is that nothing moves while P1's is a declared one-time shift — running them in the other order makes P0's null result harder to read
- **Collision group:** ⚠ **PERSISTED SHAPE. RIDES ALONE IN ITS TRAIN** (charter Wave 0). It reserves `src/generators/npcGenerator.js`, `src/lib/saves.js` and the faction/institution minting file
- **Commit authority:** edits only; the chair commits. ⛔ **The golden door is the CHAIR'S act, executed once, on the measured mover list this packet hands over**
- **Baseline posture:** measured — `src/generators/npcGenerator.js` **1345** effective against a **frozen `scripts/.size-baseline.json` entry of 1345 (ZERO headroom)**; `src/lib/saves.js` **619** (ceiling 800, no entry); `src/generators/steps/assembleInstitutions.js` **571**; `src/generators/density/densityAscension.js` **45**; all by eslint's own `Linter` under `max-lines` with `skipBlankLines` + `skipComments`. **44** golden fixtures and **46** `recordGolden` call sites exist; the lighting tuple is `2645 / 383 / 2262 / 25009 / 6670`
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
- **Evidence:** `EM-P1.evidence.md`

---

## §0 · THE DEFECT, AND WHY THE ESTATE ALREADY KNOWS IT

| Card kind | Identity today | Receipt |
|---|---|---|
| NPC | `npc.id = \`npc_${idx + 1}\`` — **the array index** | `src/generators/npcGenerator.js:1631` |
| Institution | **the display name** (`institutions.find(i => i.name === instName)`); no general id mint | `steps/assembleInstitutions.js:426, :492, :701` |
| Faction | `id: \`faction.${slug(name)}\`` — **a slug of the name** | `density/densityAscension.js:142` |

Three modules recorded the consequence independently, in their own comments:
`locksPreservation.js:228` (*"a locked `npc_3` ... may name somebody else"*),
`characterDrift.js:17` (*"a keeper moved npc_6 -> npc_8 while `npc_6` came to name a"* different
person), `characterEdit.js:51-53` (*"Every id-keyed SIDECAR is"* exposed). Design §14 makes rosters
and names editable, which is precisely what moves an index and re-slugs a name — so without this
packet a DM's layer key comes to name a different entity and the editor applies edits to the wrong
one, every regeneration.

## §1 · Reconciled authority

1. **ODQ §934.47 A — DECIDED YES** (the owner, by deferral to the chair's recommendation), read on
   the charter at `799074c99`: the ids are minted, existing saves get theirs on first read, the
   convicted readers take the id, and the goldens re-record ONCE under a signed record.
2. **ODQ §934.47** — Wave 0; this car rides alone (persisted shape).
3. **THE PROMISE** — a seed is a starting world forever. An id minted **from the step's own
   stream, in the seed's order** is a fact OF the seed, not an annotation on it. ⚠ The one-time
   golden re-record is a DECLARED shift with a signed cause, not a silent one.
4. **`PACKET_STANDARD.md` "Ungated persistence"** — the v3 migration arm runs UNCONDITIONALLY;
   a flag may gate a feature, never this.
5. **`PACKET_STANDARD.md` "Golden and behavior-shift law"** — a coding agent never regenerates a
   golden unless the packet names the exact golden, the expected shift, the authorization and the
   command. §6 and §7 name all four; the chair executes.
6. Charter Wave 0 row **EM-P1**; `EM-PREAMBLE.md`; live git state at `d31af2cee`.

**Resolved contradictions**

- The charter's row lists the three convicted readers among this packet's MODIFY targets.
  **Measured, they are a fourth, fifth and sixth existing logic file** (§3), which the hard budget
  refuses. They move to `EM-P1b`, and the split is the smallest honest one: minting an id is one
  behaviour family; re-pointing the joins that read it is another.
- The charter's "the golden fixtures gain the id keys" reads as two fixtures. **Measured, the
  candidate set is eight suites** (§6), of which only the true movers re-record.

## §2 · Outcome

**Observable result:** every NPC, institution and faction in a freshly generated settlement carries
a permanent `id` drawn from its own step's stream in the seed's order; an older save gets the same
ids on its first read; and the same seed yields the same ids forever.

**Definition of done:** the three mints exist at §6's exact contract; the v3 migration arm runs on
every save read and write; the identity round-trip passes; the measured golden movers are named
with before/after SHA-256 and handed to the chair for one signed re-record.

**In scope**

1. the three id mints (one behaviour family: entity identity);
2. the unconditional v3 save migration (the required lifecycle seam);
3. the identity round-trip battery (the prevention guard).

**Explicit non-goals**

- ⛔ **the three convicted readers** — `locksPreservation.js`, `characterDrift.js`,
  `characterEdit.js`. They are `EM-P1b`'s, because they are files four, five and six;
- `dmLayer`, the pinned mode, the registry rows, any edit surface;
- renaming or re-keying any existing id-shaped string outside the three mints;
- any second identity scheme, and any content-hash id (an id must not move when a name moves —
  that is the whole defect);
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 (entity identity) | 1 |
| New persisted record families | 0 — three new KEYS on existing records, not a new family | ≤1 |
| Named state writers | 1 per card kind, each its own generator; **one writer per state** | ≤1 |
| Feature flags | **0 — forbidden by the ungated-persistence law** | ≤1 |
| User-facing surfaces | 0 | ≤1 |
| Direct consumers | 0 in this packet (EM-P1b re-points the readers) | ≤2 |
| New logic-bearing production leaves | 0 | ≤2 |
| Existing logic-bearing production files modified | **3** — `npcGenerator.js`, `assembleInstitutions.js` + `densityAscension.js` count as the institution/faction mint pair, `saves.js` | ≤3 |
| Additional registration-only files | 1 | ≤3 |
| Handwritten files total | 6 | ≤12 |
| New/changed effective production lines | ≤120 | ≤400 |
| Delta in a shared/hot file | **0 in `npcGenerator.js` (1345/1345, ZERO headroom)** | ≤15 |
| Acceptance cases | 8 | ≤8 |

Overrides approved before dispatch: `NONE`.

⛔ **THIS PACKET SITS ON THE CEILING.** If the institution and faction mints cannot be expressed in
`assembleInstitutions.js` and `densityAscension.js` as one pair within the three-file count, the
packet STOPS AND SPLITS into **EM-P1-NPC** (the npc mint + the v3 migration) and
**EM-P1-INST-FAC** (the other two mints), each re-proving the goldens.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-P1
```

Expected: capsule emitted; ancestry and substrate proven; all MODIFY targets clean; every §5 symbol
resolving. ⚠ This car reserves the persisted shape and rides alone — confirm no sibling holds any
MODIFY path, and that `EM-P0` has landed so the two golden proofs are read in order.

## §5 · Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| NPC mint (defect) | `src/generators/npcGenerator.js` | `npc.id = \`npc_${idx + 1}\`;` | the id is the ARRAY INDEX, assigned after the roster is drawn | Replaced by the stream mint, **net zero effective lines** |
| NPC writer | `src/generators/npcGenerator.js` | `export const generateNPCs = (` | draws the roster; 23 `rng(` sites | The sole npc id writer |
| Institution roster | `src/generators/steps/assembleInstitutions.js` | `provides: ['institutions', 'catalogForTier', 'generationRepairs']` | the roster's producing step | Host of the `inst:<n>` mint |
| Institution identity (defect) | `src/generators/steps/assembleInstitutions.js` | `institutions.find(i => i.name === instName)` | identity is the display NAME; the only `id:` in the file is `repair.N` | The mint runs once per admitted row, in roster order |
| Faction identity (defect) | `src/generators/density/densityAscension.js` | `id: \`faction.${slug(name)}\`` | the id is a slug of the NAME | Replaced by the stream mint |
| Faction writer | `src/generators/power/factionGrouping.js` | `export const generateFactions = (npcs, relationships) => {` | derives factions from the roster | Read; the mint sits where the id is written today |
| The step fork | `src/generators/pipeline.js` | `const stepRng = rng.fork(name);` | every step draws from a stream forked by its NAME | **The mint draws from its own step's stream — the fact that makes an id a fact of the seed.** NOT EDITED |
| Migration seam | `src/lib/saves.js` | `function migrateSaveToV2(entry)` | its own comment: it *"runs on every read AND write path"*, which is why it recovers the seed for already-saved rows; applied at `:331, :443, :503, :684, :713, :743, :775, :850` | The v3 arm joins it, UNCONDITIONALLY |
| Save service | `src/lib/saves.js` | `export const saves` | the one service every read and write goes through | No second migration path |
| Blob chain | `src/domain/settlementMigrations.js` | `export function migrateSettlementToLatest` | pure, append-only, `to === from + 1`, idempotent, non-mutating | ⛔ **NOT appended to** — a `SCHEMA_VERSION` bump would move all 525 golden rows for a second, unrelated cause |
| Version stamp | `src/domain/settlement.schema.js` | `export const SCHEMA_VERSION` | `1`; stamped at `normalizeSettlement.js:167`, which the pipeline runs at `assembleSettlement.js:324` | **NOT bumped** |
| Golden authority | `tests/property/generatorGoldenMaster.test.js` | `function hashFor(config)` | hashes the whole serialised settlement over a 525-row fixture | Re-records ONCE, by the chair, if measured to move |
| The door | `tests/helpers/goldenRecordDoor.js` | `export function recordGolden` | `({ surface, path, produce, root })` — the estate's one re-record door, driven by `UPDATE_GOLDEN=1` | The chair's act; the command is named in §6 |
| ⛔ Convicted reader 1 | `src/domain/locksPreservation.js` | `npc_3` (in its own hazard comment at `:228`) | records that a surviving lock may name somebody else | **EM-P1b's.** Named here so it cannot be re-found as new |
| ⛔ Convicted reader 2 | `src/domain/npc/characterDrift.js` | `npc_6` (`:17`) | records the rebind | **EM-P1b's** |
| ⛔ Convicted reader 3 | `src/domain/npc/characterEdit.js` | `export const AUTHORED_MARKER_KEY` | the id-keyed sidecar family | **EM-P1b's** |
| Test precedent | `tests/domain/settlementMigrations.test.js` | `describe('Tier 1.4 — migrateSettlementToLatest behavior')` › `it('is idempotent on an already-current settlement')`, `it('does not mutate the input')` | flat literal registration; idempotency and purity arms | Copy this shape |

**Forbidden alternatives**

- no content-hash or name-derived id (that IS the defect); no second identity scheme; no id minted
  outside its own step's stream; no `Math.random`, clock or locale;
- no `SCHEMA_VERSION` bump and no `MIGRATIONS` chain entry;
- no flag, env read or conditional around the v3 arm;
- no edit to the three convicted readers, to `pipeline.js`, or to any EM-P0/EM-P2 path;
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

```js
/** The three id spellings. `n` is the 1-based position in the SEED'S OWN DRAW ORDER — the
 *  order the chooser produced the entity in, which is stable for a seed forever. It is NOT
 *  the final array index (a later sort must not renumber), and NOT derived from any name. */
//   npc:<n>     e.g. 'npc:1'      minted in generateNPCs, from that step's stream order
//   inst:<n>    e.g. 'inst:1'     minted in assembleInstitutions, in roster-admission order
//   fac:<n>     e.g. 'fac:1'      minted where the faction id is written today
```

**The mint rule, complete.** Each card kind's producing step assigns `id` once, in its own draw
order, before any sort or filter that could reorder the collection. An entity that already carries
a non-empty `id` matching its kind's pattern **keeps it** — that single rule is what makes the
migration and the generator agree, and what makes a re-run idempotent.

**The migration rule, complete.** `migrateSaveToV2`'s chain gains a v3 arm that, for every save it
passes, assigns any missing `id` to each NPC, institution and faction **in stored array order**,
and leaves every present id untouched. It runs on every read and every write path, with no flag
and no condition. ⛔ It does NOT bump `SCHEMA_VERSION` and does NOT append to `MIGRATIONS`:
the ids ride the save row's own migration, exactly as the seed recovery does.

⚠ **THE ONE HONEST ASYMMETRY, STATED RATHER THAN HIDDEN.** A pre-existing save's ids are minted in
STORED ARRAY ORDER, which equals the seed's draw order only if nothing has reordered the roster
since. For a save whose roster was reordered, the migration's ids are stable **from now on** but are
not the ids a fresh generation from the same seed would mint. That is the best any migration can
do without re-running generation, and it is recorded here so no later lane reads it as a bug.
A8 pins it.

**Absence rules** — absent `id`: minted (generation) or back-filled (migration). Empty string:
treated as absent. `null`: treated as absent; never written. An id not matching its kind's pattern:
**left alone** and reported by the round-trip test, never rewritten — silently renaming a foreign
id is how an import loses its joins.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| fresh generation | the producing step runs | — | every entity carries `<kind>:<n>` in draw order | — |
| a save with no ids | any read or write | — | ids assigned in stored array order | — |
| a save already migrated | any later read | ids present | unchanged (idempotent) | — |
| an entity with a foreign id | either path | pattern mismatch | LEFT ALONE | the round-trip test reports it |

### Determinism

- **Hash/fork key:** none — the id is a COUNTER in the step's own draw order. No hashing, so no
  collision question and no name dependency.
- **Stable enumeration:** the producing chooser's order, taken before any sort.
- **No-draw behaviour:** the mint consumes **no PRNG draw of its own**. It numbers what the stream
  already produced, so it cannot shift any other chooser. A5 asserts this.

### Flag and dormancy

- **Flag:** ⛔ `NONE`, and a flag here is FORBIDDEN (`PACKET_STANDARD.md` "Ungated persistence").
- **Golden posture:** ⚠ **A DECLARED ONE-TIME SHIFT, authorized by ODQ §934.47 A.**

  **The candidate set is EIGHT suites, measured** — the two that hash a whole settlement and the
  six that reach NPC records:
  `tests/property/generatorGoldenMaster.test.js`, `tests/domain/townCartographyCalibration.test.js`,
  `tests/property/corruptionWebDormancyGolden.test.js`, `tests/property/momentumDormancyGolden.test.js`,
  `tests/property/npcCredibilityDormancyGolden.test.js`, `tests/property/npcGrowthDormancyGolden.test.js`,
  `tests/property/npcLadderDormancyGolden.test.js`, `tests/property/roadsDormancyGolden.test.js`.

  ⛔ **A CANDIDATE IS NOT A MOVER.** The implementer MEASURES which of the eight actually move,
  names each with its fixture path and before/after SHA-256, and **STOPS**. The chair then executes
  the door ONCE over the measured movers:

  ```sh
  UPDATE_GOLDEN=1 npx vitest run <the measured movers only>
  ```

  ⛔ **The implementer never runs that command**, and a mover outside the eight is a STOP — it
  means the ids reached a surface this packet did not predict. The signed record names the cause:
  *"EM-P1, ODQ §934.47 A: entities gain permanent stream-order ids; no value, count, name or draw
  moves — only the id keys are added."*

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| minted by the producing step in draw order | every join that reads an entity (EM-P1b re-points the three convicted ones) | rides the settlement blob; no new save-row key, so `SAVED_SETTLEMENT_PATCH_KEYS` is NOT widened | the v3 arm back-fills on first read, unconditionally | the same seed re-mints the same ids — which is the property EM-B2a's layer keys rest on | n/a | **this packet is the migrate step**; an imported entity with a foreign id keeps it | ids are not secrets; no denylist or projection changes, and nothing is redacted |

### Receipts, alignment, edit story

Closed kinds: the round-trip test's report vocabulary — `MINTED`, `KEPT`, `FOREIGN`.
DM-only fields: `NONE`. Alignment: `DECLARED EMPTY`. Edit story: `ENGINE-ONLY`.

## §7 · Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/generators/npcGenerator.js` | the `npcs.forEach((npc, idx) => { npc.id = … })` block | **+0 eff (NET ZERO)** | Replace the index mint with the stream-order mint, one line for one line. ⛔ **1345 effective against a frozen baseline of 1345 — ZERO headroom; any growth reds `max-lines`.** Measure with eslint's `Linter` before and after. |
| `MODIFY` | `src/generators/steps/assembleInstitutions.js` | the roster-admission path | +25 eff | Mint `inst:<n>` once per admitted row, in admission order, before any sort. Do not touch the `repair.N` id. 571 effective, ceiling 800. |
| `MODIFY` | `src/generators/density/densityAscension.js` | `id: \`faction.${slug(name)}\`` | +10 eff | Replace the name slug with `fac:<n>` in draw order. 45 effective, ceiling 800. |
| `MODIFY` | `src/lib/saves.js` | `migrateSaveToV2`'s chain | +35 eff | Add the v3 arm per §6: back-fill missing ids in stored array order, keep present ones, leave foreign ones alone. ⛔ Unconditional — no flag, no `if` on a feature. 619 effective, ceiling 800, no baseline entry. |
| `CREATE` | `tests/domain/entityIdentity.test.js` | A1–A8 | n/a | Copy `tests/domain/settlementMigrations.test.js`'s shape (idempotency, purity, nullish safety). Flat literal `it(...)` only (`EM-PREAMBLE.md` §P3.4). |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | the `invariants` row for `tests/domain/entityIdentity.test.js` | +4 eff | ⚠ **Only if the basename matches `NAME_PATTERN` or the file lands in an `ENFORCER_DIR`** — `tests/domain` is neither, and `entityIdentity` matches no token, so **measure `enumerateInvariants` and add the row only if it picks the file.** Do not add a row the meta-test does not demand. |

**Generated artifacts:**
`tests/lint/.lighting-census-baseline.json` (regenerated, `LIGHTING_CENSUS_REFREEZE='EM-P1'`), and
⚠ **the measured golden movers, re-recorded ONCE BY THE CHAIR** through
`UPDATE_GOLDEN=1 npx vitest run <the measured movers>` under the signed record of §6.

**Predicted INTERIOR RED:** lighting `2645 / 383 / 2262 / … / …` → **`2646 / 383 / 2263 / … / …`**
(`+1 file, +0 parked, +1 credited`), caused by the one new TEST file.

**Registers that do NOT move:** `SAVED_SETTLEMENT_PATCH_KEYS` (ids ride inside `settlement`),
`SCHEMA_VERSION`, the `MIGRATIONS` chain, `scripts/check-writer-reach.mjs` (ids reach the display
through existing readers, and this packet adds no customer surface — ⚠ if the register DOES move,
that is a STOP, because a dark new written identity means nothing shows the id),
`scripts/.size-baseline.json` (net-zero edit; never raised), the five edge-shared bundles.

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch.
1. Capture the baseline: all EIGHT candidate fixtures' SHA-256; the lighting tuple; eslint `Linter`
   `max-lines` for all four MODIFY targets (expect **1345**, **571**, **45**, **619**).
2. Add the failing tests for A1–A8.
3. Implement the three mints (the pure data contract), npc first and at net zero.
4. Extend the lifecycle seam: `migrateSaveToV2`'s v3 arm, unconditional.
5. (no consumer to wire — EM-P1b re-points the readers.)
6. Add the lint registration if and only if `enumerateInvariants` demands it; regenerate the
   lighting baseline.
7. Run the focused verification of §10. **MEASURE which of the eight candidates moved, record each
   with before/after SHA-256, and STOP.**
8. Hand the chair the measured mover list for ONE signed re-record; then re-run the movers plainly
   for the green and write §12.

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behavior | a freshly generated settlement | every NPC, institution and faction carries `npc:<n>` / `inst:<n>` / `fac:<n>`; the set is complete, unique within its kind, and 1-based contiguous | `tests/domain/entityIdentity.test.js` |
| A2 | ⛔ Same seed, same ids | two generations at one seed | every entity's id is identical across the two runs — the property EM-B2a's layer keys rest on | same |
| A3 | ⛔ A RENAME DOES NOT MOVE AN ID | rename a faction and an institution, then re-read | both ids are unchanged. **This is the defect's direct negative control** (`faction.${slug(name)}` moved; `fac:<n>` does not) | same |
| A4 | ⛔ A ROSTER EDIT DOES NOT RE-POINT AN ID | remove the second NPC of five | the remaining four keep their original ids; none is renumbered, so no id comes to name a different person | same |
| A5 | ⛔ The mint takes no draw | the golden corpus before and after the mint, compared field by field except the new id keys | no value, count, name or ordering moves anywhere — the mint numbers what the stream already produced and consumes no PRNG | same |
| A6 | Migration: back-fill and idempotency | an older save with no ids, run through the real `saves` read path twice | ids appear on the first read in stored array order; the second read is byte-identical; the save is not mutated in place | same |
| A7 | Migration is UNCONDITIONAL | a source scan of the v3 arm's call site | it is reached on every save read and write path and sits inside NO conditional, flag read or env read; `SCHEMA_VERSION` is still `1` and `listMigrations()` still holds ONE entry | same |
| A8 | ⛔ Foreign ids and the stated asymmetry | an imported entity carrying a non-matching id, and a save whose roster was reordered before migration | the foreign id is LEFT ALONE and reported `FOREIGN`, never rewritten; and the reordered save's minted ids are stable across subsequent reads, with the test asserting in its own words that they need not match a fresh generation's (§6's recorded asymmetry) | same |

**8 of 8.**

## §10 · Verification commands

```sh
npx eslint src/generators/npcGenerator.js src/generators/steps/assembleInstitutions.js \
  src/generators/density/densityAscension.js src/lib/saves.js tests/domain/entityIdentity.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/entityIdentity.test.js tests/domain/settlementMigrations.test.js \
  tests/domain/userEdits.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/lifecycleRoundTrip.test.js

# THE EIGHT CANDIDATES — measure which move; do NOT re-record
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/corruptionWebDormancyGolden.test.js \
  tests/property/momentumDormancyGolden.test.js tests/property/npcCredibilityDormancyGolden.test.js \
  tests/property/npcGrowthDormancyGolden.test.js tests/property/npcLadderDormancyGolden.test.js \
  tests/property/roadsDormancyGolden.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/townCartographyCalibration.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/sizeBaseline.test.js \
  tests/lint/mutationCoverageManifest.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/check-writer-reach.mjs            # must NOT report growth — see §7
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-P1
```

The eight golden commands are EXPECTED to red on the movers before the chair's door runs; that red
is the measurement, and the receipt names each mover with before/after SHA-256. Every other command
exits `0`. ⚠ This car rides ALONE: its own bare full gate and boot smoke ARE its terminal.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- `src/generators/npcGenerator.js` grows by one effective line (1345/1345, measured);
- a fixture OUTSIDE the eight named candidates moves — the ids reached an unpredicted surface;
- any value, count, name, ordering or draw moves (A5) — only id KEYS may be added;
- the mint would consume a PRNG draw, or derive an id from a name or a position;
- `SCHEMA_VERSION` or the `MIGRATIONS` chain would need to move;
- the v3 arm would sit inside any conditional, flag read or env read;
- a fourth existing logic file must move (the three convicted readers are `EM-P1b`'s);
- `scripts/check-writer-reach.mjs` reports growth — a dark new written identity means nothing shows
  the id, which is a real finding, not a registration chore;
- the implementer is about to run `UPDATE_GOLDEN=1` — **that is the chair's act, once.**

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- The owner decision quoted (§934.47 A, DECIDED YES):
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (eslint `Linter`, before and after, all four MODIFY targets; `npcGenerator.js` expected 1345 → 1345):
- Acceptance cases A1–A8, executed and passed:
- Focused commands, exits, and counts:
- ⛔ **THE MEASURED GOLDEN MOVERS**, each with fixture path and before/after SHA-256, and the candidates that did NOT move:
- The chair's signed re-record: command, date, and the cause recorded:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- This car's own bare full gate and boot smoke, exits captured in-shell:
- Base-versus-wave failure identity diff:
- `SCHEMA_VERSION` and `listMigrations().length` before and after (expected: 1 and 1):
- `scripts/check-writer-reach.mjs` result:
- Lighting census tuple before and after:
- Generated artifacts:
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
