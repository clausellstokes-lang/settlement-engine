# Settlement editor / EM-B1e — the pulse's ruin shape gets ONE exported writer, so the DM's decree and the disaster leave the same record

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠ The branch has moved repeatedly under this lane; `d31af2cee` **IS an ancestor** of every tip
  seen and every path this packet measures is **blob-identical** across the window (evidence §0).
  Held at `d31af2cee` under **J-T1**.
- **Last revalidated:** 2026-09-19, `d31af2cee`
- **Depends on:** `NONE`. Rides in train **T3** beside **EM-B1d** — **disjoint files**, measured
  (B1d's five are `entities/npcs.js`, `density/factionLifecycle.js`, `entities/successors.js`,
  `worldPulse/envoyCasting.js`, `worldPulse/magicFormsPractitioner.js`; this packet's one is
  `worldPulse/calamityKernel.js`). **EM-B1a depends on this packet** for its `ruined` arm.
- **Collision group:** `NONE` measured against the registered manifest. ⚠ One shared path with the
  train: `tests/lint/sovereigntyLightingContract.walker.test.js` (the terminal's, deferred).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: the five-key ruin shape and its **two**
  call sites; `calamityKernel.js` is **not on the hot list and carries no
  `scripts/.size-baseline.json` entry** (831 raw lines); **`worldPulseFate` has NO closed
  vocabulary** — no typedef enumerating it, no table, no walker; its only readers treat it as free
  text or truthiness. Census tuple `2645 / 383 / 2262 / 25009 / 6670`. No test was run.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)

---

## 1. Reconciled authority

1. ⭐ **ODQ §934.47 ADDENDUM 7 (ledger `927e895f0`) — option (a).** The pulse exports ONE shared
   `ruinInstitution(inst, { reason, fate })`, its own ruin path calls it, and **there is exactly
   one writer of the pulse's ruin shape**. The DM's decree passes its own `fate`; `remnantReason`
   takes the decree's cause. **EM-B1a's `ruined` arm calls it.**
2. **ODQ §934.47 addendum 6** — the editor writes the tree's existing shapes; `EntityStatus` is
   not widened; `'removed'/'destroyed'` is the composer's vocabulary and `'remnant'/'ruined'` is
   the pulse's (`rosterProvenance.js:210`). **This packet is what makes that separation
   enforceable rather than merely stated.**
3. **THE PROMISE** — lived history is immutable. ⛔ **The pulse's own calls must produce the
   identical record**, byte for byte, or a saved world's history changes under it.
4. **`EM-PREAMBLE.md`** §P2, §P3, §P6, §P7, §P8 — cited by hash, not restated.
5. Live code at `d31af2cee` — which answers the ruling's one conditional in the negative (§2).

**Resolved contradictions:** none outstanding. The ruling's conditional — *"measure whether
`worldPulseFate` has a closed vocabulary … and, if so, price the one added value"* — resolves to
**NO**, measured (§2), so **no MODIFY row is owed for a vocabulary that does not exist.**

---

## 2. Outcome, and the ruling's conditional answered

**Observable result:** `ruinInstitution(inst, { reason, fate })` is exported from the calamity
kernel; both of its own ruin call sites go through it; the record it returns for a disaster is
**byte-identical to today's**; and a DM decree can produce the same shape with its own fate and
cause instead of a disaster's.

**Definition of done:** one exported function; the two calamity sites re-pointed; the calamity
record proved byte-equal to the pre-edit record; the decree record proved to carry the decree's
fate and cause; goldens and the preset witness unmoved; `convergence.js` untouched.

### ⛔ THE CONDITIONAL: `worldPulseFate` HAS NO CLOSED VOCABULARY — so nothing is priced for it

Measured across `src/**` (tests excluded):

| what a closed vocabulary would need | found |
|---|---|
| a typedef enumerating the values | ⛔ **none.** The two typedefs that mention it declare it **open**: `causeLifecycle.js:69` `worldPulseFate?: unknown`; `upswingKernel.js:53` `worldPulseFate?: string` |
| a frozen table or constant set | ⛔ **none** |
| a walker asserting membership | ⛔ **none** |
| readers that branch on a value | ⛔ **none.** `rosterProvenance.js:258` reads `textOrNull(inst.worldPulseFate)` — **free text**; `causeLifecycle.js:139` tests `if (inst.worldPulseFate)` — **truthiness only** |

The values are free string literals written at eight sites — `destroyed_by_disaster`,
`demoted_by_disaster`, `abandoned_with_the_settlement`, `upgraded_by_reconstruction`,
`founded_by_flourishing`, plus three computed (`magicClosureFate(patch.form)`, `fate.fate`,
`fate`). ⇒ **`ruined_by_decree` adds a value to no enumeration, so it needs no MODIFY row and
names no consumers.** The two readers above are named here as *unmoved*, which is the claim A6
executes.

⚠ **That is a finding as much as a figure.** A fate vocabulary with no closure is exactly where a
ninth spelling lands unnoticed — but minting one is a register act over eight existing writers,
**not this packet's**, and this packet does not start one. **RAISED R2.**

In scope: (1) the one exported writer; (2) the required integration — the calamity path re-pointed
(its two sites); (3) the prevention guard — the byte-equality arm, which is what stops a future
edit to the shared function from silently re-writing history.

Explicit non-goals: the DM's op itself (**EM-B1a**, which calls this); a `worldPulseFate`
vocabulary (R2); the other four ruin-adjacent paths (`institutionLifecycle`, `tierOutcomeApply`,
`settlementLifecycleFirstClass`, `magicRegimeLifecycle`) — **measured: none of them writes
`status: 'ruined'`** (§5), so none is in scope and re-pointing them would be a different member;
⛔ **`convergence.js` — the chair's explicit exclusion, and this packet does not import, read or
edit it**; any golden, tuning or migration.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0` — the shape already exists | ≤1 |
| **Named state writers** | ⭐ **`1` — and the point of the packet is that it becomes the ONLY one** | ≤1 |
| Feature flags / user-facing surfaces | `0` | ≤1 each |
| Direct production consumers | `1` (the calamity path; EM-B1a is the second, later) | ≤2 |
| New logic-bearing production leaves | `0` — no new leaf (§3.1) | ≤2 |
| **Existing logic-bearing production files modified** | **`1`** | ≤3 |
| Handwritten files total | `2` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≤20** | ≤400 |
| Delta per call site | **≤3 effective** × 2 sites | — |
| Delta in a shared/hot file | `0` — **not hot** (§3.1) | ≤15 |
| Acceptance cases | `7` | ≤8 |

Overrides approved before dispatch: `NONE` — the packet fits the default.

### §3.1 · Hot files — measured, as the chair required

```
$ grep -n "calamityKernel" docs/implementation/PACKET_STANDARD.md      → no hit
$ node -e '<scripts/.size-baseline.json lookup>'                        → none
$ wc -l src/domain/worldPulse/calamityKernel.js                         → 831
```

⇒ **`calamityKernel.js` is NOT on the standing hot list and carries no `.size-baseline.json`
entry**, so hot-file rule 1 owes no opening headroom measurement and **no new leaf is required**
— the ruling's condition for one is not met.

⚠ **831 raw lines is still large, and `max-lines` is enforced per layer with per-file overrides
generated from the baseline** (`eslint.config.js:96`). A file with no override sits under its
layer's ceiling. §8 step 1 therefore takes an **executed `max-lines` measurement with eslint's own
`Linter` before the first edit** — the estate's lesson is that an inherited or `wc -l` figure is
the one that authorizes a bad edit. If the measured headroom is under the packet's ≤20 lines, that
is a **STOP** (§11) and the function moves to its own leaf.

⛔ **`src/domain/worldPulse/convergence.js` (hot, 798/800, two lines of headroom) is NOT touched,
imported or read by this packet** — the chair's explicit exclusion, asserted by the import-fence
arm A7.

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1e
```

Expected: capsule emitted; ancestry and substrate proven; **CREATE target ABSENT**
(`tests/domain/ruinInstitution.test.js`); `src/domain/worldPulse/calamityKernel.js` **present and
clean**; every `requiredSymbols` row resolving.

⚠ **THE WORKTREE IS SHARED AND THE BASE HAS MOVED REPEATEDLY.** Re-read `git rev-parse HEAD` in
the same command as the dispatch.
⚠ **Train T3 disjointness is a preflight check, not an assumption:** EM-B1d touches five files,
none of them this one. Confirm before the seal.

---

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| ⭐ **The shape's ONLY writer today** | `src/domain/worldPulse/calamityKernel.js` | `ruin` (`:250`) — a **module-private arrow inside a function body** | `(inst, reason) => ({ ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true, worldPulseFate: 'destroyed_by_disaster', remnantReason: reason })` — **FIVE added keys, in that order** | **Becomes `export function ruinInstitution`**; the record it returns must not change by one byte for the calamity call |
| **Its two call sites** | `src/domain/worldPulse/calamityKernel.js` | `:282`, `:286` | `ruin(list[gi], 'Razed as the district collapsed…')` and `ruin(list[idx], 'Destroyed outright by the disaster.')` — **exactly two**, both passing only a reason | Re-pointed to the exported form, each ≤3 effective lines |
| ⛔ **NOT a ruin site** | `src/domain/worldPulse/calamityKernel.js` | `:274` | The **demotion** branch: `worldPulseFate: 'demoted_by_disaster'` with `name`/`id`/`description`/`tags`/`demotedFrom` — **no `status: 'ruined'`, no `_worldPulseInactive`** | ⛔ **Untouched.** Named so it is not swept in as a third site |
| **The fate reader** | `src/domain/provenance/rosterProvenance.js` | `:258` | `const fate = textOrNull(inst.worldPulseFate)` — reads it as **free text**, branches on no value | Must stay unmoved; A6 asserts a decree fate flows through it |
| **The cause reader** | `src/domain/provenance/rosterProvenance.js` | `:259` | `textOrNull(inst.remnantReason) \|\| textOrNull(inst.removedReason)` | The decree's cause lands here |
| **The truthiness reader** | `src/domain/worldPulse/causeLifecycle.js` | `:139` | `if (inst.worldPulseFate) return true` — truthiness only | Unmoved; a decree fate reads the same as a disaster's |
| **The separation this enforces** | `src/domain/provenance/rosterProvenance.js` | `:210` | *"'removed'/'destroyed' is the composer's own `STATUS_REMOVED` vocabulary, 'remnant'/'ruined' is the pulse's"* | The law this packet makes enforceable |
| **A third key's readers** | 8 files incl. `institutionStatusModel.js`, `razingExecution.js` | `_worldPulseEconomyClosed` | Read in eight non-test files | ⛔ Must remain in the shape and in its position |
| **Test precedent** | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q …')` + seven straight-line `it` | One literal `describe`, no `.each`/nesting, positive control first | Copy this proof shape (§P3.4) |

**Forbidden alternatives:** ⛔ **no second writer of the ruin shape** — that is the whole packet;
⛔ **no change to the five keys, their values for the calamity call, or their ORDER**; ⛔ no edit
to `convergence.js` or any other hot file; ⛔ no `worldPulseFate` vocabulary minted (R2); ⛔ no
re-pointing of the four other ruin-adjacent paths (none writes this shape — §2); no new leaf
unless §3.1's measurement forces one; no files outside the manifest.

---

## 6. Exact contracts

```js
/**
 * The PULSE's ruin shape, written in exactly one place.
 * @param {object} inst              the institution record to ruin
 * @param {{ reason: string, fate: string }} opts
 *        reason — what the roster shows as `remnantReason`
 *        fate   — what the roster shows as `worldPulseFate`; the caller's own word
 * @returns {object} a NEW record; `inst` is never mutated
 */
export function ruinInstitution(inst, { reason, fate });
```

⛔ **THE RETURNED SHAPE, EXACT AND IN THIS KEY ORDER** — the order is the existing literal's and
is load-bearing, because the preset witness hashes serialized pulse records:

```js
({ ...inst,
   status: 'ruined',
   _worldPulseInactive: true,
   _worldPulseEconomyClosed: true,
   worldPulseFate: fate,
   remnantReason: reason })
```

⛔ **`fate` and `reason` are BOTH REQUIRED. Neither has a default.** A defaulted `fate` would let
a caller silently stamp `destroyed_by_disaster` on a record no disaster touched — which is the
exact lie this packet exists to make impossible. An absent or non-string `fate` or `reason` is a
**throw**, not a coerced value: this is a pulse writer, and a silently-wrong history is worse than
a crash at the call site (the `rngContext` fail-closed precedent).

**The two callers, by value:**

| caller | `fate` | `reason` |
|---|---|---|
| the calamity path (this packet, both sites) | `'destroyed_by_disaster'` — **passed explicitly**, not defaulted | the site's existing string, **verbatim** |
| the DM's decree (**EM-B1a**, later) | `'ruined_by_decree'` | the decree's own cause, from the removal pool |

**Purity and lifecycle.** `ruinInstitution` is pure: it reads no world, draws no random number,
reads no clock, and **never mutates `inst`** (the existing arrow already spreads; A5 asserts the
input unmutated by deep-equal against a pre-call clone). Nothing is persisted by this packet that
was not persisted before — **the shape already exists on saved records**, so no migration, no
observed-shape door and no veil change is owed.

**Golden posture: ⛔ UNCHANGED, and it is the packet's central claim rather than a footnote.**
The calamity call must produce a record **byte-identical** to today's, so
`generatorGoldenMaster`, `dossierProseManifest` and the preset witness cannot move. A1 executes
the byte-equality directly; A4 executes the witness.

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/worldPulse/calamityKernel.js` | `ruin` → `export function ruinInstitution`; the two call sites at `:282`, `:286` | **≤20 eff total; ≤3 per site** | Lift the private arrow to an exported function taking `{ reason, fate }`, preserving the five keys **and their order**; both sites pass `fate: 'destroyed_by_disaster'` and their existing reason verbatim. ⛔ Do not touch `:274`'s demotion branch. ⛔ Measure `max-lines` first (§3.1). |
| `CREATE` | `tests/domain/ruinInstitution.test.js` | A1–A7 | `n/a` | ONE literal `describe`, **seven straight-line `it`**, no `.each`/`runIf`/nesting (§P3.4). Negatives carry `// anchored:` on the line immediately above. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the tuple | `n/a` | ⛔ **DEFERRED TO THE TERMINAL** — no edit. |

Generated artifacts: `NONE`.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — `+1 file`, INTERIOR RED** | One new test file. From `2645/383/2262/25009/6670` → **`+1 / +0 / +1 / +7 / +1`** (one literal `describe`, seven straight-line `it`). |
| P2.2 | mutation-coverage row | **NOT OWED** | No `tests/lint/` file is added (`mutationCoverage.shared.mjs:36-37`); the acceptance is `tests/domain/`. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key (`dmLayer`, `decrees`) is read, and **no new stored key is minted** — the five already exist on saved records. ⚠ One `src/` file moves and the scanner covers every `.js` under `src/`, so the check is in `checks` and **motion is a STOP**. |
| P2.4 | writer-reach | ⚠ **MEASURE — `calamityKernel.js` is inside the pulse, not behind `SURFACE_CLOSURE_STOP`** | Baseline captured at §8 step 1; a **shrink** is the plain `--write`, **growth is a mint and a chair act**. The edit is a refactor with no new read, so no motion is expected — which is a prediction, not a claim. |
| P2.5 | decision-fork / mechanism-coverage | **NOT OWED** | No seeded chooser, no pool, no draw — the function is deterministic and total. |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |
| — | edge-shared closure | **RESOLVE AT PREFLIGHT** | ⚠ This lane did **not** measure whether `calamityKernel.js` sits inside a bundle closure named in `scripts/build-edge-shared.mjs`. Unlike the earlier EM packets, this one **modifies** a production file, so the question is live: the implementer derives the closure from the metas' own `inputs` at preflight and regenerates with one `npm run build:edge-shared` if it is inside. **RAISED R3.** |

> ⛔ **THE CENSUS ROW IS DEFERRED (§417 shape)** — no edit; the manifest omits the path.
> Predicted interior red: `the estate's file count moved — re-measure, do not re-word: expected 2646 to be 2645`.

---

## 8. Ordered coding sequence

0. Dispatch and seal; re-read `git rev-parse HEAD` in the same command; confirm T3 disjointness.
1. **Capture the baselines:** ⚠ an executed `max-lines` measurement of `calamityKernel.js` with
   eslint's own `Linter` (`skipBlankLines`, `skipComments`) **before any edit** (§3.1); the five
   census figures; `sha256` of `tests/fixtures/generator-golden-master.json`;
   `node scripts/check-writer-reach.mjs`; and ⭐ **a captured pre-edit ruin record** — call the
   existing path on a fixture and keep `JSON.stringify` of the result, which is A1's oracle.
2. Add `tests/domain/ruinInstitution.test.js` with A1–A7 **failing**.
3. Lift the arrow to `export function ruinInstitution(inst, { reason, fate })`, keys and order
   preserved.
4. Re-point the two call sites, each passing `fate: 'destroyed_by_disaster'` and its existing
   reason verbatim.
5. Wire consumers: **NOT APPLICABLE** — EM-B1a is the second consumer and lands later. Skip and
   record.
6. Registrations: none owed (§7). The prevention guard is A1's byte-equality arm.
7. Run focused verification (§10), including the writer-reach comparison.
8. Run the wave-end gate per the train's plan; write the completion receipt.

---

## 9. Acceptance matrix

| ID | Case | Required observation |
|---|---|---|
| **A1** | **⛔ BYTE-EQUALITY — the packet's whole claim, and the guard** | The record the calamity path produces after the refactor is **`JSON.stringify`-identical** to the pre-edit record captured at step 1 — the same five keys, the same values, **in the same order**. Asserted for BOTH call sites' reasons. ⭐ Guard-the-guard: the oracle string is asserted non-empty and to contain `"status":"ruined"` before the equality, so the arm cannot pass on an empty capture. |
| **A2** | **The DM's fate and cause flow through** | `ruinInstitution(inst, { reason: 'Razed by the table's hand.', fate: 'ruined_by_decree' })` returns `status: 'ruined'`, `_worldPulseInactive: true`, `_worldPulseEconomyClosed: true`, `worldPulseFate: 'ruined_by_decree'`, `remnantReason: 'Razed by the table's hand.'` — the decree's own words, with **no disaster vocabulary anywhere in the record**, asserted by name. |
| **A3** | **Both arguments are required; absence THROWS** | A missing `fate`, a missing `reason`, a non-string of either, and a bare `ruinInstitution(inst)` each **throw** — never a coerced value and never a silent `destroyed_by_disaster`. Anchored by the valid call in the same arm, so the negatives cannot pass on a broken import. |
| **A4** | **⛔ THE PULSE'S HISTORY DOES NOT MOVE** | `generatorGoldenMaster` and `dossierProseManifest` are bytewise unchanged (the fixture digest asserted before and at the tip), **and the preset witness is unmoved** — the pulse's own calls produce the identical record, which A1 proves at the record level and this arm proves at the hash level. |
| **A5** | **Purity, and the input unmutated** | `inst` is proved unmutated against a pre-call clone (deep-equal), the function returns a NEW object (`not.toBe`), identical inputs give `toEqual` results, and 100 calls change nothing observable. |
| **A6** | **The two live readers read a decree ruin exactly as they read a disaster's** | `rosterProvenance`'s fate/cause read (`:258-259`) returns the decree's fate and cause as free text, and `causeLifecycle`'s truthiness test (`:139`) answers `true` — asserted through the REAL functions, with a disaster-ruined record in the same table as the control. ⭐ This is what proves `ruined_by_decree` needs no vocabulary row: the readers branch on no value. |
| **A7** | **One writer, and the exclusion honoured** | A source scan proves **`status: 'ruined'` is written in exactly one place in `src/`** — `ruinInstitution` — with the matcher proved live on a planted second writer, which is the arm that keeps a future lane from re-forking the shape. ⛔ And the import fence: `calamityKernel.js` neither imports nor references `src/domain/worldPulse/convergence.js` (the chair's exclusion), asserted in both directions. |

**7 of ≤8.**

---

## 10. Verification commands

```sh
npx eslint src/domain/worldPulse/calamityKernel.js tests/domain/ruinInstitution.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/ruinInstitution.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

# The calamity kernel's own suites and the preset witness — the implementer resolves each path at
# preflight (`ls tests/domain tests/simulation | grep -iE 'calamity|witness|preset'`); this lane
# did NOT measure them and names none. An unmeasured path is not a verified fact.

node scripts/check-observed-shape-readers.mjs
node scripts/check-writer-reach.mjs            # compare against step 1's baseline
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B1e
npm run implementation:resume -- EM-B1e
```

Expected: every command exits `0`, **except** the named census interior red until the terminal.
⛔ Never read a gate through a shell pipe (§P7).

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: the seal is missing or foreign; HEAD is not
`d31af2cee` or a descendant proved non-interfering; **`calamityKernel.js`'s measured `max-lines`
headroom is under the packet's ≤20 lines** → the function moves to its own leaf and the packet
returns to the chair; **A1's byte-equality fails by one character** — that is history moving, and
no repair is attempted in-packet; a golden, the prose manifest or the preset witness moves;
`check-writer-reach` shows **growth**; `check-observed-shape-readers` moves; a **second** writer of
the ruin shape appears necessary; the five keys, their calamity values or **their order** would
have to change; `:274`'s demotion branch appears to need editing; **`convergence.js` or any other
hot file appears to need touching**; a `worldPulseFate` vocabulary appears necessary (R2 — a
different member); `calamityKernel.js` proves to sit inside an edge-shared bundle closure and the
regeneration was not priced (R3).

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · **the pre-edit `max-lines` headroom of
`calamityKernel.js`** and the post-edit figure · exact changed files and effective-line deltas ·
**the captured pre-edit ruin record and the post-edit record, both quoted, proved identical** ·
acceptance A1–A7 executed · the mutants planted, convicted and restored digest-exact (§P6) ·
focused commands, exits and counts · the writer-reach comparison against step 1 · sealed per-step
receipt and resume status · both typecheck configurations · gate stages actually executed ·
base-versus-wave failure identity diff · dormancy/golden result and the preset witness · census
tuple before and at the tip with the interior red quoted verbatim · edge-shared closure verdict
and any regenerated artefacts, or `NONE` · deviations `NONE | STOP` · out-of-scope observations
without investigation · **judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | ✅ **The ruling's conditional is answered NO, measured (§2): `worldPulseFate` has no closed vocabulary** — no typedef enumerating it (the two that mention it declare `unknown` and `string`), no table, no walker, and no reader that branches on a value. So `ruined_by_decree` is priced at **zero**: no MODIFY row, no consumers. Confirm the reading. |
| **R2** | ⚠ **A fate vocabulary with no closure is where a ninth spelling lands unnoticed.** Eight sites write free strings today. Minting a closed vocabulary with a totality walker would be a real improvement — and it is a register act over eight existing writers, **not this packet's**. Docket it, or accept the openness on record. |
| **R3** | ⚠ **This lane did NOT measure whether `calamityKernel.js` sits inside an edge-shared bundle closure.** It is the first EM packet to modify a production file, so the obligation is live and must be resolved at preflight from the metas' own `inputs` rather than assumed. An unmeasured path is not a verified fact. |
| **R4** | **`institutionStatusModel.js` carries a FOURTH institution vocabulary** — `INSTITUTION_STATUSES = ['operational','impaired','shell']` (`:99`) — distinct from both `EntityStatus` and the pulse's ruin set. Found while measuring; **not investigated, not in scope**, and recorded so it is not discovered as new by whoever next touches institution status. |
