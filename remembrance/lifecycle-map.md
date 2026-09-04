# LIFECYCLE MAP — `worldState.concludedWars` (W-MEM)

Dock read: `…/58f0a8e2-…/scratchpad/laneKERNELMARK-tree`, HEAD `1223489c9`. Read-only; no
instrument run. Every row is CONFIRMED by quoted source unless marked PLAUSIBLE.

The ledger is a **conditional ledger** on `worldState`, so it inherits the conditional-ledger
lifecycle wholesale rather than owning a bespoke one. That is the single most important fact in
this map: the seven paths are not seven bespoke code sites, they are one registration
(`CONDITIONAL_LEDGER_KEYS`) plus two bespoke seams (the writer and the public-snapshot deny).

---

## 1. CREATE — **CARRIES**

`src/domain/worldPulse/pulseKernel.js:2826`

```js
const nextConcludedWars = recordConcludedWars({ worldState: memoryState, resolvedDeployments: war.resolvedDeployments, appliedOutcomes: applied.autoApplied, newsEntries: wizardNews?.entries, tick: worldState.tick, rules: simulationRules, deferred: deferMajors, inCanon: …, diedAtOf: …, rulingEvidence: […], windDown: !simulationRules?.warLayerEnabled });
if (nextConcludedWars) memoryState = { ...memoryState, concludedWars: nextConcludedWars };
```

One call site, one writer, at the LATE end of `consequence_fold`. Gated at
`src/domain/worldPulse/concludedWars.js:328` → `warMemoryActive(rules)` →
`rules?.warMemoryEnabled === true` (line 92). Dark ⇒ `null` ⇒ the key is never assigned ⇒
byte-identical.

⚠ **The flag survives normalization, and I checked because it could have failed here.**
`warMemoryEnabled` is a VIRTUAL rule key (`simulationRules.js:438`, in the virtual-key list, with
**no** `DEFAULT_SIMULATION_RULES` entry). `normalizeSimulationRules` (line 1103) spreads
`...input` before its coercion loop, and `BOOLEAN_KEYS` is derived from
`Object.keys(DEFAULT_SIMULATION_RULES)` (line 949) — so a virtual key is neither defaulted nor
stripped; it rides the spread. The kernel's `normalizeSimulationRules(startingWorldState.simulationRules)`
at line 313 therefore still carries it to the gate. **CONFIRMED by source; the write path is live.**

## 2. READ — **DROPS (the void)**

Exhaustive census of `concludedWars` across the repo (excluding `node_modules` and `docs/`) —
every read of the ledger, with nothing omitted:

| site | what it is |
|---|---|
| `src/domain/worldPulse/concludedWars.js:335` `recordOf(state.concludedWars)` | the WRITER reading its own prior ledger |
| `src/domain/worldPulse/worldState.js:557` | the persistence normalizer |
| `src/domain/worldPulse/residueStripGuard.js:98` | a paused-tick LEAK GUARD — reads to prove nothing was banked, surfaces nothing |
| `src/domain/display/worldSnapshotPublic.js:108` | a `WORLD_SNAPSHOT_HARD_DENY` entry — an explicit **refusal** to project |
| `src/domain/certification/subsystemRowsMemory.js:74,78,79,86` | certification register prose |
| `src/domain/certification/couplingRegistryWar.js:703-705,728-730` | coupling registry rows naming the WRITER |
| `supabase/functions/_shared/ai*Bundle.js` | the source text embedded as charter documentation |
| `tests/**`, `scripts/.observed-shape-readers-baseline.json`, `tests/lint/.tuning-inventory.json` | instruments and baselines |

**Zero product surfaces.** No component, no `src/domain/display/` read model, no `src/pdf/`, no
world book, no campaign PDF, no Foundry, no Herald, no chronicle, no dossier. The one read inside
`src/domain/display/` is the deny-list membership, which is the opposite of a read.

⚠ **And the instrument corpus cannot see it either.** `scripts/review/readerCorpus.mjs:713` emits
the `war-${save.id}` RECORD document — the very document the rubric names as `recordHome: 'war'`
for `Q-WAR-1`/`Q-WAR-2` (`scripts/review/readerRubric.mjs:117-118`) — and its body is
`{ status, exhaustion, sieges, tradeWars, dispositions, exhaustionStandings }`, all from
`warStatus.js`, all **LIVE** war state. The concluded-war ledger is not in it. So on the owner's
walk the war-memory questions cannot even be answered `dark_by_flag`-with-a-record-citation on the
preview posture: the flag is ON, and there is neither a surface nor a record to cite.

## 3. PERSIST / SERIALIZE — **CARRIES**

`src/domain/worldPulse/worldState.js:498` registers `'concludedWars'` as the LAST member of
`CONDITIONAL_LEDGER_KEYS`, and the materializer at line 557 routes it to its own normalizer:

```js
: key === 'concludedWars'
  ? normalizeConcludedWars(raw?.[key])
```

`normalizeConcludedWars` (`concludedWarRecord.js:534`) returns `undefined` for an absent,
non-object or empty ledger, and the loop's `materialized !== undefined` test omits the key —
so a dark world serializes byte-identically to one that never could record.
Pinned at `tests/store/lifecycleRoundTrip.test.js:198,473,605,615` and
`tests/domain/concludedWarLedger.test.js:268-309`.

## 4. REGENERATE / RE-DERIVE — **CARRIES**

The re-derive is the `ensureWorldState` fixpoint, and it is idempotent by test:
`tests/domain/concludedWarLedger.test.js:302-304` ensures once, ensures twice, and asserts
`twice.concludedWars` equals `once.concludedWars`.

Settlement regeneration does **not** touch it: the ledger is a campaign-level `worldState` key,
not a settlement field, and no regen site in `src/store/` names it (see the census in §2).
**CONFIRMED by absence over an exhaustive grep.**

⚠ The load-time hygiene is deliberately **UNGATED** (`concludedWarRecord.js:520-533`): it runs lit
or dark, because an arm that only cleaned malformed saves while the flag was true would hand a
later lit tick a ledger it never validated — the fail-OPEN direction on a persistence surface.
A consequence a reader must know: **a staged record with no live edge left to fold is SEALED at
load** (`concludedWarRecord.js:487`, `const sealed = row.sealed !== false`). A record imported
mid-war becomes sealed history, not a fourth state.

## 5. UNDO / RESTORE — **CARRIES (as a wholesale revert)**

`src/store/campaignAdvanceSession.js:823` banks `preWorldState: pre.worldState`; line 164 restores
`worldState: result.preWorldState`. The registry policy row for `worldState` is
`{ migrate: 'backfilled', undo: 'restored' }` (`tests/store/lifecycleRoundTrip.test.js:163`).

The whole worldState object is swapped, so records written on the undone tick are discarded with
the tick — the correct behaviour, and the only path that legitimately removes a record. Note the
interaction with the seal law: undo can un-seal a record by reverting to a pre-seal snapshot. That
is not a violation (the seal is a property of a world-line, and undo rewinds the world-line), but a
reader must not cache a `sealed` judgment across an undo.

## 6. CLONE — **CARRIES (deep, by rebuild)**

`concludedWars` takes the `normalizeConcludedWars` branch rather than `deepCloneConditionalLedger`,
and the normalizer constructs fresh objects for every sub-shape. Proven at
`tests/domain/concludedWarLedger.test.js:287`:
`expect(ledger['war.ashford.kelby.3.0']).not.toBe(raw.concludedWars['war.ashford.kelby.3.0'])`.

⚠ One residual: the forward-version carry at `concludedWarRecord.js:514-516`
(`known[field] = row[field]`) and the unknown-fact carry at line 271 (`carried[key] = row[key]`)
**share references** for fields this build does not know. Known fields are all rebuilt. This is a
correctness-preserving choice for a shape nobody may mutate (records are append-closed), but it is
a real asymmetry and a reader must never mutate a value it reads back.

## 7. IMPORT / MIGRATE — **SPLIT: migrate CARRIES, public-snapshot import DROPS**

- **Save/campaign migrate — CARRIES.** `runWorldStateMigrations` (`worldState.js:292`) runs ahead
  of the conditional-ledger pass; no migration touches the key, and the ledger is then re-normalized.
- **New campaign from an import — N/A.** `src/store/campaignImportedCreation.js:50` builds
  `worldState: ensureWorldState(null, …)` — a fresh world, no ledger to carry.
- **⛔ PUBLIC SNAPSHOT / GALLERY / WORLD EXPORT — DROPS, PERMANENTLY.**
  `src/domain/display/worldSnapshotPublic.js:108` hard-denies the key, and the file states the cost
  in its own words: *"a world IMPORTED from a public snapshot re-enters with an empty ledger, and
  its pre-import wars are then unrecorded FOREVER, because this ledger never backfills."*
  Consumers of that serializer: `src/lib/worldExport.js:47`, `src/components/gallery/MapShareEditor.jsx:24`,
  and the server-side mirror tracked by `tests/security/snapshotDenylistDrift.test.js`.

---

## The one-line summary

**Six of seven paths carry the records. The seventh — the public-snapshot / gallery / world-export
import — drops them irrecoverably by deliberate security policy. The genuine gap is not a lifecycle
hole at all: it is path 2, READ, which no product surface occupies.**
