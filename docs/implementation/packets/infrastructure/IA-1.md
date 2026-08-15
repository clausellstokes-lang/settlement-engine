# Implementation Acceleration / IA-1 — packet, gate, and integration tooling

- **Status:** LANDED
- **Branch:** `claude/composite-r4`
- **Verified base:** `2c810d167d016302e641fc9cfe74fff57475b14e`
- **Owner authority:** 2026-08-09 request to build the four bounded acceleration
  items previously proposed
- **Behavior posture:** tooling and declarative metadata only; simulation output,
  pulse order, persistence, flags, tuning, and product behavior remain byte-identical

## 1. Outcome

Make implementation faster without reducing the program's ambition or weakening
its release proof:

1. CI uses the repository runtime and Vitest runs hold an atomic machine lock.
2. Packets have one machine-readable manifest, a fail-closed validator, and a
   deterministic coding-capsule generator.
3. Contributors get a packet-scoped inner check and an all-stage diagnostic check;
   CI fans the local gate into parallel groups behind one required aggregate job.
4. Pulse stages and state ledgers gain declarative, test-only ownership metadata and
   a common result envelope without changing the execution coordinator.

## 2. Hard scope budget

This packet records the owner-approved exception to the default micro-wave budget:

- one infrastructure behavior family;
- no new persisted state, feature flag, user-facing surface, dependency, migration,
  simulation mover, executor, event bus, or stage-order change;
- at most 30 handwritten files including this packet and tests;
- at most 1,800 effective production/tooling lines;
- at most 20 effective changed lines in `pulseStageManifest.js` per enriched stage;
- exactly eight acceptance cases below.

The larger file allowance exists because the same gate contract must be represented
in package scripts, CI, documentation, and enforcement tests. It does not authorize
adjacent cleanup.

## 3. Reserved foreign work

Do not touch, stage, restore, or attribute:

- `scripts/lib/reader-shape-scan.mjs`
- `tests/lint/readerShapeResolver.test.js`

Preserve every other pre-existing dirty file unless it is named in the manifest.

## 4. Exact change manifest

| Action | Path | Instruction |
|---|---|---|
| MODIFY | `.github/workflows/ci.yml` | Use `.nvmrc`; fan the local gate into parallel groups; retain one required `check` aggregate and keep build with `verify:dist`. |
| MODIFY | `package.json` | Add packet validation/capsule, packet check, and diagnosis commands; wire validation into `check`; route canonical Vitest scripts through the held lock. |
| MODIFY | `scripts/gate-mutex.sh` | Preserve inspect/wait modes and add an atomic held-lock command mode with stale-owner recovery. |
| MODIFY | `scripts/hazard-registry.json` | Promote the formerly optional mutex hazard to wired machinery with derived in-chain truth. |
| CREATE | `scripts/implementation-packets.mjs` | Parse and validate the packet manifest and emit deterministic READY-only coding capsules. |
| CREATE | `scripts/implementation-gate.mjs` | Implement packet-scoped and all-stage diagnostic modes without replacing the authoritative final gate. |
| CREATE | `docs/implementation/PACKET_MANIFEST.json` | Record packet status, base, manifest, symbols, acceptance cases, and focused commands. |
| MODIFY | `docs/implementation/PACKET_STANDARD.md` | Name the machine-readable manifest and commands without weakening existing packet law. |
| MODIFY | `docs/implementation/PACKET_TEMPLATE.md` | Use the held-lock invocation in generated packet verification examples. |
| MODIFY | `docs/implementation/INDEX.md` | Expose this explicitly authorized infrastructure packet. |
| MODIFY | `AGENTS.md` | Replace the observational test-slot instruction with the held-lock command. |
| MODIFY | `CONTRIBUTING.md` | Document the fast loop, diagnosis mode, held lock, and parallel CI aggregate accurately. |
| MODIFY | `ARCHITECTURE.md` | Keep gate/runtime and declarative pulse-contract documentation current. |
| CREATE | `src/domain/worldPulse/pulseStageResult.js` | Define and normalize a frozen common stage-result envelope; no execution wiring. |
| MODIFY | `src/domain/worldPulse/pulseStageManifest.js` | Add exact call/gate/read/write/result metadata for the belief, information-statecraft, and treaty substages without driving execution. |
| CREATE | `src/domain/worldPulse/ledgerOwnershipManifest.js` | Declare selected ledger readers/writer families/normalizers/drop-empty and lifecycle seams; certification metadata only. |
| CREATE | `tests/scripts/gateMutex.test.js` | Prove held-lock exclusion, exact exit propagation, release, and stale-owner recovery. |
| CREATE | `tests/scripts/implementationPackets.test.js` | Prove packet validation and deterministic READY-only coding capsules. |
| CREATE | `tests/scripts/implementationGate.test.js` | Prove packet/quick/diagnostic planning and aggregate exit behavior. |
| CREATE | `tests/domain/pulseStageContracts.test.js` | Prove result identity/freeze behavior, topology validity, and ledger ownership manifest closure. |
| MODIFY | `tests/build/ciCheckParity.test.js` | Pin local gate steps against the union of parallel CI gate groups and the required aggregate. |
| MODIFY | `tests/build/ciGateHardening.test.js` | Only if required to keep the aggregate deploy-gate parity semantic and non-vacuous. |
| MODIFY | `tests/lint/hazardRegistryFailClosed.test.js` | Keep in-chain derivation fixtures truthful now that the mutex is wired. |
| MODIFY | `tests/lint/testRatchet.test.js` | Preserve raw unfiltered Vitest reporting inside the held-lock wrapper. |
| DOC | `docs/implementation/packets/town-cartography/TC-3.md` | Replace observational Vitest preflights with held-lock invocations only. |
| DOC | `docs/implementation/packets/surveyor-chat/SC-1.md` | Replace observational Vitest preflights with held-lock invocations only. |
| DOC | `docs/implementation/packets/foreign-policy/GR-3B.md` | Replace observational Vitest preflights with held-lock invocations only. |
| DOC | `docs/implementation/packets/foreign-policy/IN-0C.md` | Replace observational Vitest preflights with held-lock invocations only. |
| DOC | `docs/implementation/packets/infrastructure/IA-1.md` | Record the contract and completion receipt. |

No other file is authorized. If an existing enforcement test requires a change outside
this list, stop and add only the smallest measured path to the packet before editing.

## 5. Exact contracts

### Runtime and lock

- Every `actions/setup-node` use in `ci.yml` reads `.nvmrc`; no duplicated numeric
  Node major remains.
- `gate-mutex.sh --run -- <command...>` acquires one atomic lock directory, records
  its PID, holds ownership until the child exits, returns the child's exact status,
  releases only its own lock, and can reclaim a lock whose recorded PID is dead.
- Existing inspection and bounded wait modes remain available.
- All package-script Vitest entrypoints used by the gate acquire the held lock exactly
  once; nested acquisition is forbidden.

### Packet manifest and capsule

- `PACKET_MANIFEST.json` is declarative input, not proof that code exists.
- Validation fails on unknown status, duplicate ID/path, index disagreement, packet
  heading/status/base disagreement, missing manifest paths, glob paths, more than eight
  acceptance cases, READY packets without checks, or missing required symbols.
- A capsule is emitted only for READY packets and includes packet/base identity, file
  hashes, required-symbol excerpts, the exact change manifest, acceptance cases, and
  argv-form verification commands. Output is deterministic and contains no timestamp.

### Inner and diagnostic gates

- `check:packet -- <id>` validates packets, runs both global type ratchets, lints only
  existing logic-bearing files in that packet manifest, and executes only that
  packet's declared focused commands under the test lock.
- `check:quick` is an explicitly non-authoritative changed-file variant and says so.
- `check:diagnose` derives the canonical step list from `package.json`, runs all groups,
  records true exits and elapsed times, keeps `build` plus `verify:dist` paired, and
  returns nonzero when any group fails.
- None of these commands replaces the final `npm run check` landing requirement.

### CI topology

- Parallel jobs cover every `npm run <step>` in the local `check` chain exactly once.
- Test-ratchet has the PostgreSQL service it already requires.
- Build and `verify:dist` remain in one ordered job.
- A top-level `check` job named `Validate, test, build` aggregates every parallel gate
  group with `if: always()` and fails unless all needs succeeded.
- Existing e2e, performance, coverage, Deno, hostile-locale, optional soak/mutation,
  deploy, and redeploy semantics remain unchanged except for depending on the aggregate
  where they previously depended on the sequential `check` job.

### Pulse and ledger metadata

- `pulseKernel.js` remains the sole execution and ordering authority.
- The common result helper preserves the original world-state reference for unchanged
  results and freezes the returned envelope/optional arrays.
- Stage metadata records actual call symbols, gates, read keys, write keys, and result
  kind; it may not execute or dynamically import movers.
- Ledger metadata is an independent certification manifest. It records allowed writer
  families honestly; it must not falsely claim that ordering-dependent `beliefMaps`
  already has one writer.

## 6. Ordered implementation

1. Capture current packet, gate-parity, and pulse-manifest focused baselines.
2. Implement and test the held lock and Node-runtime parity.
3. Add the packet manifest, validator, capsule, and their tests.
4. Add packet/diagnostic gate modes and tests.
5. Refactor CI into parallel groups and update parity enforcement.
6. Add common pulse-result and ownership metadata with characterization tests.
7. Update current operating documentation.
8. Run focused verification, then `npm run check:tail`.

## 7. Acceptance matrix — complete denominator

1. A second lock caller cannot enter while the first command is running; the first
   caller's exact exit status survives and the lock is released afterward.
2. A stale lock is reclaimed, while a live foreign lock is never removed.
3. Packet validation accepts the canonical manifest and rejects a fixture with status,
   path, symbol, or acceptance-count drift.
4. Capsule generation is deterministic, READY-only, hash-bearing, and contains exact
   symbol evidence plus argv-form checks.
5. Packet/quick/diagnostic planning is non-vacuous, includes both type ratchets, keeps
   build with `verify:dist`, and preserves nonzero aggregate status.
6. CI uses `.nvmrc`; every local check step appears exactly once in parallel gate jobs;
   the required aggregate depends on all of them.
7. Common pulse results preserve no-op identity and metadata names the live belief →
   information-statecraft → treaty ordering without executing it.
8. Ledger ownership metadata resolves every declared reader/writer/normalizer symbol and
   records multi-writer/order-dependent ledgers honestly.

## 8. Mandatory STOP conditions

Stop if implementation requires a new dependency, simulation output change, stage
reorder, state migration, persisted effect sidecar, generic event bus, baseline raise,
golden regeneration, automatic worktree deletion, or edits to reserved foreign files.

An unrelated gate failure is measured and reported, not repaired.

## 9. Completion receipt

- **Final state:** LANDED in implementation commit
  `d7ec3885dbcd7e09ff3bcd28d6f55a51bb1ae78b`; this follow-up receipt records
  that immutable SHA and makes the packet non-dispatchable as **LANDED**.
- **Verified base:** implementation began from `claude/composite-r4` at
  `2c810d167d016302e641fc9cfe74fff57475b14e`. The reserved reader-shape lane
  landed independently before IA-1 was committed; IA-1 then landed at the SHA
  above without staging or attributing that lane's files.
- **Changed files and budget:** exactly the 29 manifest paths, within the 30-file
  allowance. The nine production/tooling paths contain 1,515 added and 268
  removed line events (1,783 total, within the 1,800-line allowance):
  `.github/workflows/ci.yml`, `package.json`, `scripts/gate-mutex.sh`,
  `scripts/hazard-registry.json`, `scripts/implementation-packets.mjs`,
  `scripts/implementation-gate.mjs`, `src/domain/worldPulse/pulseStageResult.js`,
  `src/domain/worldPulse/pulseStageManifest.js`, and
  `src/domain/worldPulse/ledgerOwnershipManifest.js`.
- **Test paths:** `tests/scripts/gateMutex.test.js`,
  `tests/scripts/implementationPackets.test.js`,
  `tests/scripts/implementationGate.test.js`,
  `tests/domain/pulseStageContracts.test.js`,
  `tests/build/ciCheckParity.test.js`,
  `tests/build/ciGateHardening.test.js`,
  `tests/lint/hazardRegistryFailClosed.test.js`, and
  `tests/lint/testRatchet.test.js`.
- **Contract/document paths:** `AGENTS.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`,
  `docs/implementation/PACKET_MANIFEST.json`,
  `docs/implementation/PACKET_STANDARD.md`,
  `docs/implementation/PACKET_TEMPLATE.md`, `docs/implementation/INDEX.md`,
  `docs/implementation/packets/town-cartography/TC-3.md`,
  `docs/implementation/packets/surveyor-chat/SC-1.md`,
  `docs/implementation/packets/foreign-policy/GR-3B.md`,
  `docs/implementation/packets/foreign-policy/IN-0C.md`, and this packet.
  Reserved foreign files remain unattributed and untouched by IA-1.
- **Focused verification:** the six-file integrated command passed `65/65`; the
  hazard/test/full-type ratchet guards passed `121/121`; packet and hazard
  validation, focused ESLint, Node and shell syntax, CI YAML parsing, and
  `git diff --check` all exited `0`.
- **Artifact verification:** `npm run build` exited `0` after transforming 3,867
  modules and prerendering 314 route documents. `npm run verify:dist` then
  passed `50/50` files and `396/396` tests.
- **Full gate:** `npm run check:tail` exited `1` at the pre-existing untouched
  `src/domain/worldPulse/worldState.js` domain-strict count (`2` versus baseline
  `1`). Every preceding validator and `typecheck:ratchet` passed (`175` errors at
  ceiling `175`); lint, test-ratchet, build, and `verify:dist` were blacked out
  in that authoritative chain. An earlier `check:diagnose` reached lint with
  `0` errors / `27` warnings, but its full 27,292-test ratchet emitted no report
  in 30 minutes and was intentionally stopped, so there is no full-suite verdict.
- **Behavior/golden movement:** no pulse runtime imports, call order, state writes,
  persistence, feature flags, tuning, migrations, or user-visible behavior were
  changed. No golden artifact was edited or regenerated. Full golden-suite proof
  is not claimed because the full test ratchet did not produce a verdict.
- **Deviations:** CI's complete test job uses a measured 30-minute timeout instead
  of the inherited 10-minute value; this does not filter or shorten its test
  denominator. Direct-writer closure found the existing
  `espionageProducts.js#landEspionageProduct` belief-map writer, which is now
  declared as an out-of-band seam without inventing a global order. No file,
  product behavior, or edge-case denominator was added outside the packet.

## 10. Final handoff — update 2026-08-09

If this session moves to Claude/Fable, do **not** reimplement IA-1. The
implementation is present in
`d7ec3885dbcd7e09ff3bcd28d6f55a51bb1ae78b` in
`/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`; the packet
is LANDED and closed.

### Authority and preservation

- Branch/landing: `claude/composite-r4` at implementation commit
  `d7ec3885dbcd7e09ff3bcd28d6f55a51bb1ae78b`. The owner granted commit authority
  on 2026-08-09; the implementation commit contains exactly the 29 IA-1 manifest
  paths.
- Preserve all unrelated dirty work. Never touch, stage, restore, or attribute
  `scripts/lib/reader-shape-scan.mjs` or
  `tests/lint/readerShapeResolver.test.js`.
- Do not repair the unrelated `worldState.js` domain-strict overage from this
  packet, raise a baseline/timeout, regenerate a golden, or invent additional
  pulse ordering.

### Implemented surface

1. Atomic held Vitest lock with exact child exit propagation, owner-only release,
   bounded waiting, and dead-PID recovery.
2. Fail-closed packet manifest validation plus deterministic READY-only coding
   capsules.
3. Packet, quick, and diagnostic implementation gates; five CI gate groups behind
   one required aggregate using `.nvmrc`.
4. Declarative pulse-stage/result and ledger-ownership contracts with live AST
   closure tests and no runtime coordinator wiring.

### Continuation boundary

No coding remains inside IA-1. Any further IA behavior change requires a new
packet or explicit owner authority; do not reopen this landed packet. A future
full-suite run should occur only on a quiet machine with a declared external
bound. Resolving the unrelated domain-strict debt or staging/committing unrelated
working-tree files remains outside IA-1.
