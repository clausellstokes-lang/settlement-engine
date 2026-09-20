# `simulation / participation` — EM-B1k: the participation view is a READ projection and must never be the WRITE base

- **Status:** `DRAFT`
- **Packet version:** `1`
- **Verified base:** `__BASE__`
- **Last revalidated:** `__BASE__`
- **Depends on:** `NONE` — it floats with top priority and builds in the slot ahead of everything waiting
- **Collision group:** `NONE` — measured: no non-terminal packet reserves any of its paths
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — the seam and its two write bases; the eight `npcs`-writing movers; the irreversible consumers; the existing `fullRoster` merge and its two gates; bundle and edge-shared membership of every candidate file; the line-addressed and stamped registers; `pulseKernel.js`'s size ceiling; golden and fixture purity
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

> **REVALIDATION SENTENCE for the chair:** *"Revalidated at `<tip>`: `buildSettlementMap` still
> builds the write base from `item.settlement`; the snapshot item still carries `save`;
> `factionDensityKernel`'s `stillEmpty` confirmation still reads `fresh`; `pulseKernel.js` still
> measures 1581 effective lines against its 1581 baseline; the seven `requiredSymbols` are present
> verbatim; no non-terminal packet reserves a change path."*

## 0. ⛔ STOP AND SPLIT — declared at compile, at the chair's own seam

The ruled cure has three parts. Measured against the budget, **they do not fit one packet**:
four production files (`pulseKernel.js`, `factionDensityKernel.js`,
`settlementLifecycleFirstClass.js`, `successorNpc.js`) exceed *"≤3 existing logic-bearing
production files modified"*, and `successorNpc.js` is in the **eager first-paint** graph while the
others are not — a different budget entirely.

**The split is the chair's own line — the write base first and alone:**

| packet | scope | why here |
|---|---|---|
| ⭐ **EM-B1k (this one)** | cure **(1)** — the write base, in `pulseKernel.js` alone | ⭐ **MEASURED: cure (1) ALONE stops BOTH defects** (§2 / evidence §2). The data loss stops, and the dissolution stops with no consumer edit, because `factionDensityKernel`'s own `stillEmpty` confirmation was correct all along and failed only because its base was filtered too. |
| **EM-B1k2 (chartered here, compiled next)** | cure **(2)** the irreversible consumers read RAW explicitly + the two unreachable permanent writers, and cure **(3)** the ratchet widening and the real disposition | defense-in-depth: `tickStart` (`:704`) still READS the filtered view, so the reaction is still *produced* and merely refused. The class cannot be allowed to return by a future edit to that guard. |

⛔ **This packet does not close the class.** It stops the bleeding — the data loss and the
dissolution — and EM-B1k2 removes the habitat. Both are owed; neither is deferred.

---

## 1. Reconciled authority

1. **The chair's ruling of 2026-09-19:** *"THE PARTICIPATION VIEW IS A READ PROJECTION AND MUST
   NEVER BE THE WRITE BASE."* Candidate (c) implemented as (a); candidate (b) **REFUSED** (it
   re-opens the chokepoint the roads design closed).
2. **`DESIGN_THE_ROADS.md` §8** — the ONE participation chokepoint is a *participation* filter.
3. **§810.4 R18** (`factionLifecycle.js:55-86`) — *"an IRREVERSIBLE consequence may only be
   triggered by IRREVERSIBLE causes."*
4. **The tree's own confirmation comment** (`factionDensityKernel.js:258-262`) — *"An irreversible
   consequence may only fire on a fact that is still true at the moment it is applied."*
5. **The tree at the verified base**, measured — every row of §5.

### §1.1 · Resolved contradictions — two, measured

- *"the roads lane already protects hostages"* (`roadsKernel.js:1094-1096`, in its own words) →
  **true but lane-local and doubly gated**: `roadsActive` AND a spatial digest (`:342-348`). The DM
  reproduction loses the person **with `roadsEnabled: true` as well as without** (evidence §3).
- *"the cure needs a new merge"* → **it does not**: `roadsKernel`'s `fullRoster` already implements
  the by-id merge the chair specified, and the snapshot item already carries the raw `save`
  (`worldSnapshot.js:139-146`).

---

## 2. Outcome

**Observable result:** a person the tick did not itself remove is never missing from the settlement
the tick writes — and no permanent consequence is decided from a roster the participation filter
shortened.

**Definition of done:** the DM shelves somebody, the world advances, and the persisted roster still
holds them; un-shelving works; a house whose sole member is shelved still reads `crewed`.

In scope: ONE seam (`buildSettlementMap` and the `localSettlements` seed); the by-id merge rule
stated per writer; the red-first reproduction as acceptance arms.

Explicit non-goals: ⛔ **no repair of already-damaged saves** (§12.1 says exactly what survives).
⛔ No consumer edits, no ratchet widening — those are **EM-B1k2**, chartered in §0. ⛔ No change to
`isOffStage`, to any participation read, or to `worldSnapshot`'s filter. ⛔ No editor packet work;
EM-B1f stays BLOCKED on this landing.

---

## 3. Hard scope budget

| Limit | Budget | This packet |
|---|---:|---:|
| Behavior families | `1` | **1** |
| New persisted record families · writers · flags · surfaces | `0 or 1` | **0 · 0 · 0 · 0** |
| New logic-bearing production leaves | `<=2` | **0** |
| Existing logic-bearing production files modified | `<=3` | ⭐ **1** |
| Handwritten files total | `<=12` | **3** |
| New/changed effective production lines | `<=400` | ⛔ **0 — see §3.1** |
| Effective lines per new leaf | `<=250` | n/a |
| Delta in a shared/hot file | `<=15` | ⛔ **0 REQUIRED** |
| Acceptance cases | `<=8` | **7** |

### §3.1 · ⛔⛔ HOT FILE — `pulseKernel.js` IS AT ITS CEILING, EXACTLY

```sh
$ node -e "…scripts/.size-baseline.json…"   src/domain/worldPulse/pulseKernel.js => 1581
$ node -e "…eslint Linter, max-lines skipBlankLines+skipComments…"   pulseKernel.js effective lines: 1581
```
**1581 / 1581 — ZERO headroom**, and `tests/lint/sizeBaseline.test.js` pins the baseline against
the live measurement (`:103`, `:120`). The file's own comments show it is already being managed at
this ceiling (`:576-578` — *"`;`-joined at +0 effective lines against the frozen ceiling"*).

⇒ ⛔ **THE EDIT MUST BE NET ZERO EFFECTIVE LINES.** §6 contracts it as **two single-line
replacements and no additions**. A helper function, an added guard line, or a reformat is a
**STOP** — raising the baseline is a chair act, not a lane's.

### §3.2 · Bundle budgets, priced

| budget | ceiling | member? | cost |
|---|---:|---|---:|
| generation worker `WORKER_BUNDLE_CEILING_BYTES` | `1,401,208` — ZERO slack | **NO** | **0 B** |
| eager first paint `EAGER_FIRST_PAINT_MODULES` | closure budget | **NO** (`pulseKernel.js` is not eager) | **0 B** |
| lazy `engine` chunk | `< 679_000` | main-graph member | **~0 B** — two token-level replacements, no new import |
| `advanceInterval.worker` | ⛔ none today; TOOL-3 mints one with **4 KB per-train headroom** | **YES** | **a DELTA, ≈0 B; no per-packet re-mint (chair Q3)** |
| edge-shared bundles | INPUT membership | ⭐ **NO — `pulseKernel.js` is an input of neither** | **no rebuild, no `_shared` rows** |

⭐ **`worldSnapshot.js` *is* an input of both bundles — and this packet does not touch it.** That
is a further reason the split falls where it does: EM-B1k owes **zero** generated paths, so its
`checks` carry no generator and the step-14a ordering hazard does not arise.

### §3.3 · Registers

`scripts/.size-baseline.json` — §3.1, the binding one. `tests/lint/.tuning-inventory.json` names
`pulseKernel.js` and is line-addressed, but `tuningRegister.walker.test.js` keys on `spanDigest`
and pins the insert-above case explicitly ⇒ **not a red**, and a net-zero edit cannot move a line
anyway. `docs/content/wiring-census.json` `stamp.files` (7 entries) names **none** of the
candidates ⇒ **no re-take**. `tests/lint/.prose-numerics-baseline.json` does not name it, and no
figure is rendered.

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1k
```
**branch/ancestry** — `head === verifiedBase`, the substrate arm returns early; **substrate** — no
`REGISTER` row, so nothing declared sits in the window; **CREATE targets absent** — one CREATE
(`tests/store/participationWriteBase.test.js`), absent at the base (measured); **non-CREATE targets
clean**; **required symbols resolve** — the seven rows of §5, each `grep -cF` = 1.
`node scripts/implementation-packets.mjs validate` passes: **no non-terminal packet reserves any
path and EM-B1k is not in the 190-entry register.**

---

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| ⭐ **The seam** | `src/domain/worldPulse/pulseKernel.js` | `function buildSettlementMap` (`:178`) | `settlement: localSettlements.get(id) \|\| item.settlement` — the write base, **born filtered**; called once, at `:1506`, on `postTimeSnapshot` | THE one place the base changes. |
| ⭐ **The seed** | `src/domain/worldPulse/pulseKernel.js` | the `localSettlements` write (`:579`) | `localSettlements.set(id, vaulted.settlement)` — descends from `item.settlement` | The second half of the same base. |
| **The raw roster, already present** | `src/domain/worldPulse/worldSnapshot.js` | `export function buildWorldSnapshot` (`:94`); the item shape (`:139-146`) | every item carries `save`; `saveSettlement(save)` is `save?.settlement \|\| save` (`:11-13`) | ⛔ **Read it. Do not edit this file** — it is an input of both edge bundles. |
| ⭐ **The merge rule, already written** | `src/domain/worldPulse/roadsKernel.js` | `const fullRoster` (`:395`-ish) | iterate the RAW roster; take the tick's version of each person by `npcId`, else the raw one | ⛔ **The contract's merge is this algorithm, verbatim in meaning.** Not edited here. |
| **The merge key** | `src/domain/worldPulse/npcAgency.js` | `export function npcId` (`:194`) | `${saveId}:${npc?.id \|\| stablePart(name \|\| label \|\| 'npc_'+index)}` — id-first with a positional FALLBACK | A4 pins that the fallback is unreached on real data. |
| **The guard that was right all along** | `src/domain/density/factionLifecycle.js` | `export function factionRosterOf` (`:113`) | filters by `isOnRoster`; consumed by `stillEmpty` (`factionDensityKernel.js:262`) over `fresh` | Preserve. A3 proves it refuses once its base is raw. |
| **The write-back** | `src/store/campaignPulseHelpers.js` | `export function applyWorldPulseResultToState` (`:106`) | `:197` assigns wholesale; `:232` the store's save, `:243` the DB payload; **no merge anywhere** | Preserve unedited — cured upstream. |
| **The DM's writer** | `src/store/settlementPendingEditWriters.js` | `export function applyNpcOp` (`:65`) | `:131` `npc.stasis = { reason }`, reached from the Availability select | A1 drives it. |
| **Test precedent** | `tests/store/wizardNewsCommitReconcile.test.js` | its `describe`/`test` shape | a `tests/store/**` file importing a store helper under the default `node` environment | ⭐ A1 copies it — **under vitest `import.meta.env` exists, so no loader stub is needed.** |
| **Test precedent** | `tests/domain/roadsParticipation.test.js` | *"the raw save roster is UNTOUCHED"* | the live pin that the filter does not mutate the save | A5 extends its guarantees. |

Forbidden: ⛔ no edit to `worldSnapshot.js`, `isOffStage`, or any participation read; ⛔ no
consumer edits (EM-B1k2's); ⛔ no new helper function in `pulseKernel.js` (§3.1); no files outside
the manifest.

---

## 6. Exact contracts

### The seam, after this packet — two single-line replacements, NET ZERO effective lines

```js
// :184, inside buildSettlementMap — ONE line replaced, none added
      settlement: localSettlements.get(String(item.id)) || item.save?.settlement || item.settlement,
```
```js
// :579 — ONE line replaced, none added: the tick's settlement-level work is kept, the ROSTER is the raw one
    localSettlements.set(String(item.id), { ...vaulted.settlement, npcs: (item.save?.settlement?.npcs) || vaulted.settlement.npcs });
```
⛔ **No third line. No helper. No reformat.** `item.save?.settlement` is the raw save settlement —
`saveSettlement`'s exact meaning (`worldSnapshot.js:11-13`), inlined because the ceiling forbids an
import.

### The merge rule, per writer — and why a merge is not separately needed

Under this contract the update's **roster is the raw roster from birth**, so there is exactly ONE
roster again and every mover's own write lands on it. Stated per writer (evidence §4):

| writer | write | rule |
|---|---|---|
| `factionDensityKernel:602` · `magicFormsPractitioner:250` | an **ARRIVAL** (`[...npcs, founder/minted]`) | append to the raw base — the arrival is persisted (**A4**) |
| `npcVerdictPulse:142` · `factionDensityKernel:647` | a replacement roster | replaces the raw base |
| `applyWorldPulseBetrayal:51` · `npcAgency:235` · `npcGrowthKernel:597` | per-person marks via `.map` | map over the raw base |
| `roadsKernel:1102` | whereabouts, already built from `fullRoster` | **becomes redundant** — noted, not removed (§12.1) |

⛔ **THE DEFENSIVE RULE, for any writer that replaces the roster wholesale:** the result must be
`fullRoster`'s algorithm — *iterate the raw roster; take the tick's version of a person by `npcId`
when it has one, else the raw one* — so that **nothing a mover did is lost and nothing the filter
hid is dropped.** A4 asserts both halves.

### ⛔ THE ONE RISK, stated so it can be refused

Three writers (`applyWorldPulseBetrayal`, `npcAgency`, `npcGrowthKernel`) `.map` the update roster
with an index. Under a raw base they iterate **more people than today**, so an off-stage person's
mark is now refreshed where before it was skipped. All three compute from `worldState` keyed by
`npcId` rather than from position, so the expected effect is a refreshed mark, not a
miscomputation — **PLAUSIBLE, and A5 is the arm that must prove it.** If A5 reds, that is the
packet's STOP, not a renegotiation.

### Absence · determinism · dormancy · golden posture

**Absence:** a save with no `settlement` falls through to `item.settlement` exactly as today
(the `||` chain preserves it). **Determinism:** no draw, no key, no ordering change — the raw
roster's order is the save's own. **Dormancy:** a world with nobody off-stage has
`item.settlement === saveSettlement(item.save)` by reference (`worldSnapshot.js:131` returns `_s`
unchanged), so the tick is **byte-identical**. **Golden posture: UNCHANGED, and EXECUTED** — no
fixture contains `stasis` or `whereabouts` and generation writes neither key (evidence §7), so the
cure can only change worlds where the bug fires.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| nothing | participation reads unchanged | ⭐ **the fix** — the persisted roster is whole | unchanged | unchanged | `pulseUndoStack` unchanged | unchanged | unchanged (the veil reads the save) |

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/worldPulse/pulseKernel.js` | `buildSettlementMap` (`:184`) and the `localSettlements` seed (`:579`) | ⛔ **+0 eff** | §6's two single-line replacements, verbatim. ⛔ **NET ZERO effective lines — measure with eslint's `Linter` before and after and quote both.** No helper, no added guard, no reformat. |
| `CREATE` | `tests/store/participationWriteBase.test.js` | A1 · A2 · A4 | **≤250 eff** | The red-first reproduction as a suite: the DM's own act through `applyNpcOp`, the shipped pulse with `commit: true`, and the real `applyWorldPulseResultToState`. ⛔ Imports its opener from `'vitest'`; straight-line literal `it`s only; ⛔ never name a variable `it`, `test` or `describe`. Model: `tests/store/wizardNewsCommitReconcile.test.js`. |
| `TEST` | `tests/domain/roadsParticipation.test.js` | the master-gate describe | `n/a` | A3 and A5 — **two** new straight-line `it`: a sole-member house survives (`crewed`, no beat); the participation guarantees are unchanged. ⛔ Do not touch the `.npcs` inventory ratchet — widening it is **EM-B1k2's**. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | one row keyed `tests/store/participationWriteBase.test.js` | `+1 row` | ⚠ **OWED ONLY IF `tests/store` is an enforcer dir or the basename matches `NAME_PATTERN` — measured NO on both** (`ENFORCER_DIRS` has no `tests/store`; the basename carries no pattern token). ⛔ **This row is therefore NOT taken.** Kept in the table as the measured negative so the next reader does not re-derive it. |

⛔ **No `_shared` rows and no generator in `checks`** — `pulseKernel.js` is an input of neither
edge bundle (measured). **Generated artifacts: NONE.**

*(The `REGISTER` row above is a measured negative and is **not** in the JSON manifest; the §7 table
and the JSON are set-equal over the three real rows.)*

### §7.1 · The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED** | ⛔ NO ABSOLUTE QUOTED. DELTA: **`+1 files / +0 parked / +1 credited / +5 titles / +1 suiteTitles`** — one new CREDITED test file (opener imported from `'vitest'`, straight-line literal `it`s: A1, A2, A4 = three) plus two new `it` in an existing credited file. The chair stamps the absolute. |
| P2.2 | mutation-coverage | **NOT OWED — measured** | `ENFORCER_DIRS` = `tests/{lint,design,docs,data,copy,security,edgeFunctions,generators}` — **no `tests/store`** — and `participationWriteBase` matches no `NAME_PATTERN` token. |
| P2.3 | observed-shape | **NOT OWED** | No save-time key read. ⚠ the scanner covers `src/**` and one file moves ⇒ in `checks`; **motion is a STOP.** |
| P2.4 | writer-reach | ⚠ **measure, do not assume** | shrink = `--write`; **growth is a mint and a chair act.** |
| P2.5 · P2.7 | fork · prose-numerics | **NOT OWED** | no draw; no figure; the baseline does not name the file. |
| P2.10 | edge-shared | ⭐ **NOT OWED** | `pulseKernel.js` is an input of neither bundle (measured). |
| P2.11 | byte budgets | **PRICED — §3.2** | zero into the worker and first paint; ~0 B elsewhere. |
| steps 13 · 15 | line-addressed · stamped | **NOT A RED** | `.tuning-inventory.json` keys on `spanDigest`, and a net-zero edit moves no line; `wiring-census` `stamp.files` does not name the file. |
| ⛔ **the size ratchet** | `scripts/.size-baseline.json` | ⛔ **BINDING — §3.1** | **1581 / 1581, zero headroom.** A non-zero delta is a STOP. |

---

## 8. Ordered coding sequence

0. Dispatch and seal.
1. **Capture the baselines:** `node -e` with eslint's `Linter` on `pulseKernel.js` (expect
   **1581**); `check-writer-reach`; `check-observed-shape-readers`.
2. **Write the reds first and watch them fail with today's exact messages** (§9 quotes them):
   `6 of 7` and `npc_target_missing` for A1; `["The Crown"]` + `faction_dissolved` for A3.
3. **Make the two single-line replacements** (§6) and nothing else.
4. **Re-measure the effective lines — it must read 1581 again.** A different number is a STOP.
5. Run the focused suites, then the golden and dormancy set (§10).
6. Write the completion receipt.

```text
1. the snapshot is built as today — the FILTERED view is handed to participation reads
2. the update's settlement is seeded from item.save.settlement (the RAW roster)
3. movers write onto that base; a wholesale roster replacement merges by npcId per §6
4. campaignPulseHelpers:197 lands a settlement that never lost a person the tick kept
```

---

## 9. Acceptance matrix

| ID | Case | Required observation | today's RED |
|---|---|---|---|
| **A1** | ⭐ **THE DM'S OWN ACT.** A generated town; one NPC shelved through `applyNpcOp('stasis-npc')`; one tick with `commit: true` through the shipped entry; the real `applyWorldPulseResultToState`. | the persisted roster holds **all seven**, in both `state.savedSettlements[0].settlement.npcs` and `persistUpdates[0].settlement.npcs`; **`return-npc` then succeeds**. | `6 of 7`; `{"ok":false,"status":"failed","reason":"npc_target_missing"}` |
| **A2** | **A ROADS HOSTAGE.** ⚠ The real mover needs `roadsActive` **and** a spatial digest **and** a capture roll across ticks, so the lawful smallest construction is used: the mover's own shape `whereabouts: { state:'hostage', placeId, … }` (`roadsKernel.js:1073`) written onto the save, then one tick. **Stated as a construction, not a claim that the mover ran.** | the hostage is in the persisted roster. | lost, 6 of 7 (`pulse-repro.mjs` run C) |
| **A3** | **A SOLE-MEMBER HOUSE SURVIVES.** Its one member shelved; one tick. | the house reads `crewed`, is still in `powerStructure.factions`, and **no `faction_dissolved` beat** fires. The active-member control is unchanged. | `houses: ["The Crown"]`, `beats: ["faction_dissolved"]` |
| **A4** | **THE MERGE LOSES NOTHING.** A death during the tick; an arrival during the tick; both with an off-stage person present. | the death **is** persisted, the arrival **is** persisted, and the off-stage person is **also** present — all three at once. ⛔ Includes the `npcId` fallback pin: every roster member carries `id` and `name`, so the positional fallback is unreached. | n/a (new) |
| **A5** | ⛔ **THE PARTICIPATION READS ARE UNCHANGED — the packet's chief burden.** | a shelved person is still never cast (`rosterPersonAvailable`), never travels (`roadsKernel`), never ladder-eligible (`eligibleMembersOf`), never holds the war seat (`readWarSeatBooks` → `unseated`); `buildWorldSnapshot` still returns the **same settlement reference** when nobody is off-stage. | n/a (regression) |
| **A6** | ⛔ **NOTHING MOVES, EXECUTED.** | `generatorGoldenMaster`, `dossierProseManifest`, the roads dormancy golden and the preset-lighting witness are bytewise unchanged — justified by measurement: no fixture holds `stasis`/`whereabouts` and generation writes neither. | n/a |
| **A7** | **THE CEILING HELD.** | `pulseKernel.js` measures **1581** effective lines after the edit, and `tests/lint/sizeBaseline.test.js` is green. | n/a |

Seven of ≤8.

---

## 10. Verification commands

```sh
npx eslint src/domain/worldPulse/pulseKernel.js tests/store/participationWriteBase.test.js tests/domain/roadsParticipation.test.js
npm run typecheck:ratchet && npm run typecheck:domain:strict

npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/participationWriteBase.test.js tests/domain/roadsParticipation.test.js \
  tests/domain/roadsState.test.js tests/domain/warSeatBooks.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/generators/densityLaw.test.js
# ⛔ NOTHING MOVES — every golden this packet could touch, named
npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js \
  tests/property/roadsDormancyGolden.test.js tests/lint/sizeBaseline.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/domain/advanceWorkerByteIdentity.test.js

node scripts/check-observed-shape-readers.mjs     # motion is a STOP
node scripts/check-writer-reach.mjs               # shrink = --write; growth = a chair act
node scripts/implementation-packets.mjs validate
```
⛔ **No generator among them** — this packet owes no edge-shared rebuild, so step 14a's ordering
hazard does not arise.

---

## 11. Mandatory STOP conditions

1. ⛔ `pulseKernel.js` does not measure **1581** effective lines after the edit.
2. ⛔ **A5 reds** — a participation guarantee moved. The raw base changed a read it must not.
3. ⛔ Any golden, the dormancy golden or the preset witness moves.
4. ⛔ `check-writer-reach` or `check-observed-shape-readers` **grows**.
5. ⛔ The edit needs a third line, a helper, or a second file.
6. ⛔ A1 or A3 does not reproduce its stated red before the fix.
7. ⛔ `tests/lint/sizeBaseline.test.js` reds.

---

## 12. Completion receipt

Record with executed output: the two reds before and their greens after; the effective-line count
before and after (**1581 → 1581**); every golden's result; writer-reach and observed-shape
before/after; the lighting DELTA caused (`+1 files / +5 titles / +1 suiteTitles`) **as a delta**.

### §12.1 · NOTICED, NOT TOUCHED — each specific enough to slot

1. ⛔ **EM-B1k2** — cures (2) and (3): `factionDensityKernel`'s `tickStart` (`:704`) reads RAW
   explicitly; `settlementLifecycleFirstClass:611` (dispersal must carry the off-stage soul) and
   `successorNpc:66` cured with the class **before either is lit**; the ratchet widens to
   `src/domain/density` (measured: it convicts exactly **one** new file,
   `factionLifecycle.js`) and `factionDensityKernel.js`'s census row gains a real
   **irreversible ⇒ RAW** disposition in place of the inherited blanket. Slot: immediately after
   this packet, same train.
2. ⚠ **`roadsKernel`'s `fullRoster` compensation becomes redundant** once the base is raw
   (`:1094-1102`). Leave it — it is harmless and self-consistent — but its comment should be
   re-pointed at this packet so the next reader does not think it is the estate's only defence.
   Slot: EM-B1k2.
3. ⚠ **`successorNpc.js` is in the EAGER first-paint graph** while every sibling is not; any
   packet touching it prices a first-paint delta. Named for EM-B1k2's compile.
4. ⚠ **Dangling relationship edges already exist in damaged saves** — see §12.2. No repair is
   built; the chair decides whether one is wanted.
5. ⚠ **`tests/store` is not an enforcer dir and `NAME_PATTERN` does not match
   `participationWriteBase`** — so the estate's most load-bearing new regression suite owes no
   mutation-coverage row. Worth a chair look at whether `tests/store` should join `ENFORCER_DIRS`.

### §12.2 · What old saves hold — measured, for the owner's question

```
ERASED PERSON: Dorothea Eindriðason / npc_1     persisted roster length: 6
  npcs[] by id              : false       ⛔ the RECORD is gone
  keys that still name them : relationships, factions, pressureSentence
  relationships entries: 12 | relationships name them: true
  factions[].members[]      : [0,0,0,0,0,0]   populationHistory: a count, not a roster
```
⇒ **the person's record is unrecoverable** — role, importance, affiliation, personality, secrets,
influence all went with the array entry. What survives is their **NAME**, in dangling
`relationships` edges, a `factions` mention, and a rendered `pressureSentence` about somebody the
roster no longer contains. A repair could restore a name and re-hang edges; it could not restore
the person. The only true rewind is the whole-tick `pulseUndoStack` snapshot, which is bounded.

---

## 13. RAISED — for the chair

- **Q1 — the split.** §0 declares it at the chair's own seam because four production files exceed
  the budget and `successorNpc.js` is eager. Confirm EM-B1k2 as chartered in §12.1 item 1.
- **Q2 — the one risk (§6).** Three movers will iterate more people under a raw base. A5 is the
  proof; if the chair wants that risk removed instead of proven, the alternative is to keep the
  base filtered and merge by id **at the write-back** — but that leaves the dissolution live and
  needs cure (2) in the same packet, which is what the budget refused.
- **Q3 — `tests/store` and `ENFORCER_DIRS`** (§12.1 item 5).
- **Q4 — a repair for damaged saves?** §12.2 says exactly what could be recovered. Not built.
