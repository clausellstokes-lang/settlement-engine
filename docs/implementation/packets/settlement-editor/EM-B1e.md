# Settlement editor / EM-B1e — the pulse's ruin shape gets ONE exported writer, so the DM's decree and the disaster leave the same record

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Landed at:** `8f714cf3ceabef10c735f23b05783c7cddfcba34` — the pulse's ruin shape has ONE exported writer, `ruinInstitution(inst, { reason, fate })`, both arguments required and neither defaulted; both calamity records BYTE-IDENTICAL across the refactor (captured through the exported `advanceCalamity` before the first edit and after the last); all three goldens unmoved, the preset witness above all; +4 effective lines (the raw +41 is JSDoc); two mutants convicted (key order → only A1; the fate guard → only A3); `check:packet` 14/14 and `implementation:resume` exit 0; built in a second slot worktree in the slot's idle window while EM-B1d version 5 was drafted. Minified +437 B in the uncapped `advanceInterval.worker` (TOOL-3 prices it).
- **Packet version:** 2
  > **WHAT VERSION 2 CHANGED AND WHY.** Re-measured whole against the build branch's tip by an Opus
  > pre-proof lane. **Not one verified fact about the tree was refuted** — all four declared paths
  > are blob-identical to the compile base, so every line number in §5 still holds. What changed is
  > everything the compile lane could not or did not measure. Four obligations were **priced to
  > zero by execution**: the edge-shared rebuild (R3, now CLOSED — this file is in none of the five
  > bundle closures, proved twice), the mutation-coverage row (executed against the estate's own
  > enumerator with a positive control), the bundle budgets (the packet lands in **no budgeted
  > chunk**), and the `max-lines` STOP (**347 effective lines of headroom**, so no new leaf and no
  > deferred measurement). Three defects in the packet itself were found and fixed: **A7's oracle
  > was unimplementable as written** (a raw scan finds four, the estate's shared `codeOnly` finds
  > zero; only a comment-only strip finds the true one), **the "preset witness" was invoked four
  > times without a path** (now named, and its key-order premise confirmed from its own header),
  > and **`advanceWorkerByteIdentity` protects nothing here** (it is a relative sync-vs-worker pin).
  > Three couplings the draft never knew about were added: a **LANDED packet (MF-T2R) pins this very
  > file** (its symbol joins `requiredSymbols`), a **live walker (`ruinFilterRoster`) is kept green
  > only by the single line this packet moves** — which makes the old §11 escape hatch a trap — and
  > `worldPulseFate`'s truthiness reader has a **real consequence** (criminal leashes sever), inert
  > here only because the writer emits three sufficient signals at once, which A6 now proves. The
  > register absolutes were replaced by DELTAS because the packet now **FLOATS**.
- **Verified base:** `fixes-2026-09-18-consist` at `fa931e5080b04795dc41ab97d952cbf2c6cd8727`
- **Last revalidated:** 2026-09-19 at `fa931e5080b04795dc41ab97d952cbf2c6cd8727` — stamped by the chair at promotion, the window re-run in the same command as the stamp: since the pre-proof lane's tip `58fcfe614` the branch gained the EM preamble's §P2 row 12 (`e68d913e6` — this packet's own pre-proof already carried its two laws as brief steps 11 and 12) and the fourth docs fold (`fa931e508`); over every change-manifest and `requiredSymbols` path `git diff --stat 58fcfe614 HEAD` printed NOTHING, the CREATE target is absent and all five required symbols resolve verbatim. THE ORDER (R8), RULED BY THE CHAIR: this packet is built NOW, in the slot's idle window while EM-B1d version 5 is being drafted, and lands FIRST; EM-B1d version 5's base is stamped after this landing, so nothing can move under this packet's seal. The pre-proof lane's measured sentence: *Re-measured at `58fcfe61458b784b0470b854caf916b7c2961edf` by the Opus pre-proof lane (session 7d3418f8, 2026-09-19 ~17:3x EDT). `d31af2cee` is an ancestor. Over every change-manifest and `requiredSymbols` path the window `d31af2cee..58fcfe614` is **EMPTY — `git diff --stat` printed nothing** — and each of the four production paths is **blob-identical** base → tip (`calamityKernel.js` 73c5203, `rosterProvenance.js` ad44785, `causeLifecycle.js` d4405a8, `status.js` 190fae9), so every line number in §5 is unchanged. All **five** `requiredSymbols` resolve verbatim (`grep -c` ≥ 1 each). The CREATE target is absent on disk and unknown to git. Evidence §1–§23.*
- **Depends on:** `NONE`.
  ⭐ **THIS PACKET FLOATS** — charter, *Amendments of 2026-09-19 17:26 EDT* (ODQ §934.47 addendum
  21): *"floating | **EM-B1e** (the pulse's one ruin writer): its header says `Depends on: NONE`,
  its two paths touch no other member's — it is pre-proofed NOW and built whenever the slot would
  otherwise wait for a READY packet, joining whichever train is open."* ⛔ That amendment
  **supersedes** the charter's two older EM-T5 rows, which still list this packet as a T5 member,
  and supersedes version 1's *"Rides in train T3 beside EM-B1d"*.
  **EM-B1a depends on this packet** for its `ruined` arm (EM-B1d §2a).
- **Collision group:** `NONE` — **measured against the live registered manifest (188 entries): no
  entry, at any status, names either of this packet's two paths in a `changeManifest`** (evidence
  §4). Disjointness from EM-B1d holds through its v5 re-cut (evidence §21), with **one watch item**:
  EM-B1d may home a new vocabulary in `src/domain/entities/status.js`, which is a `requiredSymbols`
  path of this packet and therefore part of its dispatch *substrate*. The cure is ORDER, not a
  workaround — and the chair ruled the order at promotion (R8): **EM-B1e lands FIRST**, in the slot's idle window; EM-B1d version 5 is placed after it.
  ⚠ One shared path with whichever train this joins: `tests/lint/sovereigntyLightingContract.walker.test.js`
  (that train's terminal act; deferred, never this packet's).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured, and **re-measured at the tip by the pre-proof lane**. Executed:
  the five-key ruin shape and its **two** call sites, both at the line numbers §5 records;
  `calamityKernel.js` is **not on the hot list and carries no `scripts/.size-baseline.json` entry**,
  and its **`max-lines` figure is 453 effective against the `src/domain/**` ceiling of 800 — 347
  lines of headroom**, measured with a control that reproduces eslint's own arithmetic exactly;
  **`worldPulseFate` has NO closed vocabulary**; the file sits in **no budgeted bundle chunk** and
  in **no edge-shared closure**; `tests/domain` is **not** a mutation-coverage enforcer directory.
  ⛔ **NO CENSUS ABSOLUTE IS QUOTED** — version 1's tuple was stale and this packet floats; only the
  DELTA it causes appears (§7). No test was run by this lane.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1 — stamped by the chair at promotion; the preamble gained §P2 row 12 at `e68d913e6` after the pre-proof lane verified `1cf54427…faf6`)
  > ⓘ **Verified by the pre-proof lane at the tip:**
  > `1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6`
  > (`shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md`). Left unstamped by design.

---

## 0. Train placement — FLOATING, and what that forces

This packet is built **whenever the slot would otherwise wait for a READY packet**, joining whichever
train is open. Two consequences bind every figure below:

1. ⛔ **Every register prediction is a DELTA, never an absolute.** The lighting tuple is mid-train
   and will be refrozen by some other train's terminal before this packet builds, so an absolute
   quoted here would be false by the time it mattered (the chair's R11 rule).
2. ⛔ **The census row is the HOST TRAIN's terminal act**, not this packet's — and which train that
   is, is not yet known. §7 states the delta; the terminal re-derives the tuple whole.

---

## 1. Reconciled authority

1. ⭐ **ODQ §934.47 ADDENDUM 7 — option (a).** The pulse exports ONE shared
   `ruinInstitution(inst, { reason, fate })`, its own ruin path calls it, and **there is exactly one
   writer of the pulse's ruin shape**. The DM's decree passes its own `fate`; `remnantReason` takes
   the decree's cause. **EM-B1a's `ruined` arm calls it.**
2. **ODQ §934.47 addendum 6** — the editor writes the tree's existing shapes; `EntityStatus` is not
   widened; `'removed'/'destroyed'` is the composer's vocabulary and `'remnant'/'ruined'` is the
   pulse's (`rosterProvenance.js:210`). **This packet is what makes that separation enforceable
   rather than merely stated.**
   ⓘ **Where `ruined` went, re-measured:** the charter's EM-T3 row still reads *"`jailed` **and
   `ruined`** into the two typedefs"*, but EM-B1d v4 narrowed to `jailed` and its §2a routes the
   institution-state contract to **EM-B1a**, not here: *"`EntityStatus` is NOT widened … EM-B1a's
   `set-institution-state` offers the pool of five and, for `ruined`, writes the pulse's own shape
   through EM-B1e's shared `ruinInstitution` writer."* ⇒ ⭐ **THIS PACKET OWES NO TYPEDEF MEMBER FOR
   `ruined`, AND NONE IS OWED ANYWHERE.** `ruined` already exists at the tip as the pulse's own
   literal — `rosterProvenance.js:81`,
   `INACTIVE_STATUSES = Object.freeze(['removed','destroyed','remnant','ruined'])`. The charter row
   is stale prose (**R5**).
3. **THE PROMISE** — lived history is immutable. ⛔ **The pulse's own calls must produce the
   identical record**, byte for byte, or a saved world's history changes under it.
4. **`EM-PREAMBLE.md`** §P2 (incl. rows 10–11: edge-shared INPUT membership and the byte budgets,
   both priced in §7), §P3, §P6, §P7, §P8 — cited by hash, not restated.
5. Live code at the tip — which answers the ruling's one conditional in the negative (§2).

**Resolved contradictions:** none outstanding. The ruling's conditional — *"measure whether
`worldPulseFate` has a closed vocabulary … and, if so, price the one added value"* — resolves to
**NO**, re-measured at the tip (§2), so **no MODIFY row is owed for a vocabulary that does not
exist.**

---

## 2. Outcome, and the ruling's conditional answered

**Observable result:** `ruinInstitution(inst, { reason, fate })` is exported from the calamity
kernel; both of its own ruin call sites go through it; the record it returns for a disaster is
**byte-identical to today's**; and a DM decree can produce the same shape with its own fate and
cause instead of a disaster's.

**Definition of done:** one exported function; the two calamity sites re-pointed; the calamity
record proved byte-equal to the pre-edit record; the decree record proved to carry the decree's fate
and cause; goldens and the preset witness unmoved; `convergence.js` untouched.

### ⛔ THE CONDITIONAL: `worldPulseFate` HAS NO CLOSED VOCABULARY — so nothing is priced for it

Re-measured across `src/**` (tests excluded) at the tip:

| what a closed vocabulary would need | found |
|---|---|
| a typedef enumerating the values | ⛔ **none.** The two typedefs that mention it declare it **open**: `causeLifecycle.js:69` `worldPulseFate?: unknown`; `upswingKernel.js:53` `worldPulseFate?: string` |
| a frozen table or constant set | ⛔ **none** |
| a walker asserting membership | ⛔ **none** |
| readers that branch on a value | ⛔ **none.** `rosterProvenance.js:258` reads `textOrNull(inst.worldPulseFate)` — **free text**; `causeLifecycle.js:139` tests `if (inst.worldPulseFate)` — **truthiness only** |

The values are free string literals written at eight sites. ⇒ **`ruined_by_decree` adds a value to
no enumeration, so it needs no MODIFY row and names no consumers** — and it is **absent from `src/`
and `tests/` entirely**, so it collides with no fixture, pin or allowlist (§12 sweep).

⭐ **THE CONSEQUENCE, READ — because a set's consumers are its meaning.** The truthiness reader is
not decoration: `causeLifecycle.js:137-141`'s `institutionDestroyed` marks a criminal institution
**destroyed — its arrangement can no longer be sustained**, severing an NPC's criminal leash. But it
is **inert for this writer BY CONSTRUCTION**: `ruinInstitution` emits `_worldPulseInactive: true`,
`status: 'ruined'` and the fate *together*, and `institutionDestroyed` returns `true` at its FIRST
check (`_worldPulseInactive`) and again at its LAST (`'ruined'` ∈ `NONSTANDING_STATUS`) — **three
independently-sufficient signals, so the new fate value never decides anything.** A6 proves this by
execution rather than asserting it. ⛔ The *design* question this raises — a decree-ruin is an
authored act joined to an irreversible consequence — belongs to **EM-B1a's undo**, not to this
writer. **RAISED R9.**

⚠ **A fate vocabulary with no closure is a finding as much as a figure** — it is exactly where a
ninth spelling lands unnoticed. But minting one is a register act over eight existing writers, **not
this packet's**, and this packet does not start one. **RAISED R2.**

In scope: (1) the one exported writer; (2) the required integration — the calamity path re-pointed
(its two sites); (3) the prevention guard — the byte-equality arm and the single-writer scan, which
together stop a future edit from silently re-writing history or re-forking the shape.

Explicit non-goals: the DM's op itself (**EM-B1a**, which calls this); a `worldPulseFate` vocabulary
(R2); the other four ruin-adjacent paths (`institutionLifecycle`, `tierOutcomeApply`,
`settlementLifecycleFirstClass`, `magicRegimeLifecycle`) — **measured: none writes `status:
'ruined'`** (§5), so none is in scope; re-pointing the 28 test fixtures that hand-build the shape
(**R7**); ⛔ **`convergence.js` — the chair's explicit exclusion, and this packet does not import,
read or edit it**; any golden, tuning or migration.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0` — the shape already exists | ≤1 |
| **Named state writers** | ⭐ **`1` — and the point of the packet is that it becomes the ONLY one** | ≤1 |
| Feature flags / user-facing surfaces | `0` | ≤1 each |
| Direct production consumers | `1` (the calamity path; EM-B1a is the second, later) | ≤2 |
| New logic-bearing production leaves | `0` — no new leaf (§3.1, **measured**) | ≤2 |
| **Existing logic-bearing production files modified** | **`1`** | ≤3 |
| Handwritten files total | `2` (+1 deferred census row, the host train's) | ≤12 |
| New/changed effective production lines | **≈10; cap ≤20** | ≤400 |
| Delta per call site | **≤3 effective** × 2 sites | — |
| Delta in a shared/hot file | `0` — **not hot** (§3.1) | ≤15 |
| Acceptance cases | `7` | ≤8 |

Overrides approved before dispatch: `NONE` — the packet fits the default.

### §3.1 · Hot files and `max-lines` — ⭐ MEASURED BY THE PRE-PROOF LANE, not deferred

```
$ grep -n "calamityKernel" docs/implementation/PACKET_STANDARD.md   → no hit
$ <lookup in scripts/.size-baseline.json>                            → no entry
$ <every max-lines rule in eslint.config.js>                         → 'src/domain/**/*.js' => max 800
                                                                        (:712, skipBlankLines+skipComments)
$ <effective-line count, using the estate's own codeOnly to find all-comment lines>
  raw lines 832 · EFFECTIVE 453 · ceiling 800 · HEADROOM 347 effective lines
  CONTROL roadsKernel.js effective=838 — EXACTLY its frozen .size-baseline value of 838
```

⇒ **`calamityKernel.js` is NOT on the standing hot list, carries no `.size-baseline.json` override,
and has 347 effective lines of headroom against a ≤20-line packet.** The control proves the counter
reproduces eslint's own arithmetic, so this is a measurement rather than an estimate.

⇒ ⭐ **NO NEW LEAF IS REQUIRED, and version 1's "measure before the first edit or STOP" is
DISCHARGED.** §8 step 1 keeps the measurement as a **confirmation** (a shared tree moves), not as a
discovery. ⚠ PLAUSIBLE only in that eslint itself was not executed — forbidden to the pre-proof
lane; the count and its control are CONFIRMED.

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
clean**; every `requiredSymbols` row resolving. The pre-proof lane read the dispatch's checks one by
one (evidence §17) and all six pass at the tip; check 6 (branch identity) is the build lane's own
act — the dispatch demands the worktree be ON the verified branch.

⚠ **THE WORKTREE IS SHARED AND THE BASE HAS MOVED REPEATEDLY.** Re-read `git rev-parse HEAD` in the
same command as the dispatch.
⚠ **Disjointness is a preflight check, not an assumption.** Re-confirm that no concurrently-building
packet has taken either of this packet's two paths — and, if EM-B1d v5 is still in flight, that its
new vocabulary did not land in `src/domain/entities/status.js` since the base was stamped (R8).

---

## 5. Verified tree contract

Every row re-found **by symbol** at the tip; all four files are blob-identical to the compile base,
so these line numbers are exact (evidence §2–§3).

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| ⭐ **The shape's ONLY writer today** | `src/domain/worldPulse/calamityKernel.js` | `ruin` (`:250`) — a **module-private arrow inside a function body** | `(inst, reason) => ({ ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true, worldPulseFate: 'destroyed_by_disaster', remnantReason: reason })` — **FIVE added keys, in that order** | **Becomes `export function ruinInstitution`**; the record it returns must not change by one byte for the calamity call |
| **Its two call sites** | `src/domain/worldPulse/calamityKernel.js` | `:282`, `:286` | `ruin(list[gi], 'Razed as the district collapsed…')` and `ruin(list[idx], 'Destroyed outright by the disaster.')` — **exactly two**, both passing only a reason | Re-pointed to the exported form, each ≤3 effective lines |
| ⛔ **NOT a ruin site** | `src/domain/worldPulse/calamityKernel.js` | `:274` | The **demotion** branch: `worldPulseFate: 'demoted_by_disaster'` with `name`/`id`/`description`/`tags`/`demotedFrom` — **no `status: 'ruined'`, no `_worldPulseInactive`** | ⛔ **Untouched.** Named so it is not swept in as a third site |
| ⛔ **NOT the arrow — a rename TRAP** | `src/domain/worldPulse/calamityKernel.js` | `:816` | `ruin:` is an **object KEY in a prose template** (`` `…lies in ruin` ``), in a different function | ⛔ **Untouched.** A `s/ruin/ruinInstitution/` sweep would corrupt rendered prose. Rename by hand, at the three sites named above |
| ⭐ **THE ENCLOSING FUNCTION IS ALSO PRIVATE** | `src/domain/worldPulse/calamityKernel.js` | `applyStrikeToRoster` (`:222`) | **not exported** | ⇒ A1's oracle **cannot** import the writer; it drives `advanceCalamity` (`:567`) instead — see §8 step 1 |
| ⭐ **A LANDED PACKET PINS THIS FILE** | `src/domain/worldPulse/calamityKernel.js` | `export function forceCalamityStrike` (`:492`) | **MF-T2R (LANDED)** holds this as a `requiredSymbols` row on the exact file this packet modifies | ⛔ **Must survive verbatim.** Added to this packet's `requiredSymbols` so the landed pin is discharged here too |
| **The fate reader** | `src/domain/provenance/rosterProvenance.js` | `:258` | `const fate = textOrNull(inst.worldPulseFate)` — reads it as **free text**, branches on no value | Must stay unmoved; A6 asserts a decree fate flows through it |
| **The cause reader** | `src/domain/provenance/rosterProvenance.js` | `:259` | `textOrNull(inst.remnantReason) \|\| textOrNull(inst.removedReason)` | The decree's cause lands here |
| ⭐ **The truthiness reader, AND ITS CONSEQUENCE** | `src/domain/worldPulse/causeLifecycle.js` | `institutionDestroyed` (`:137`), the read at `:139` | `if (inst.worldPulseFate) return true` — and a `true` here means a criminal institution's **arrangement can no longer be sustained** (`:131-133`). The guard's FIRST check is `_worldPulseInactive === true` (`:139`); its LAST is `NONSTANDING_STATUS.has(status)` with `'ruined'` a member (`:135`) | Unmoved. ⭐ A6 proves the new fate is **inert**: the writer emits three sufficient signals, so deleting the fate key changes no verdict |
| **The separation this enforces** | `src/domain/provenance/rosterProvenance.js` | `:210`; the set at `:81` | *"'removed'/'destroyed' is the composer's own `STATUS_REMOVED` vocabulary, 'remnant'/'ruined' is the pulse's"*; `INACTIVE_STATUSES = Object.freeze(['removed','destroyed','remnant','ruined'])` | The law this packet makes enforceable. ⓘ **No test pins this set in either direction** (§12 sweep) |
| **A third key's readers** | 8 files incl. `institutionStatusModel.js`, `razingExecution.js` | `_worldPulseEconomyClosed` | Read in eight non-test files | ⛔ Must remain in the shape and in its position |
| ⭐ **A LIVE WALKER KEPT GREEN BY THE MOVED LINE** | `tests/lint/ruinFilterRoster.walker.test.js` | `READER_RE = /\.institutions\b/`, `COMPLIANT_RE = /institutionRoster\|_worldPulseInactive/` | **Measured: `calamityKernel.js` IS enrolled as a roster reader, and its ONLY compliance token is `_worldPulseInactive` at `:251`** — the exact line this packet moves. It does not import `institutionRoster` | ✅ Inert on the main path (the lift stays **in-file**, so the token stays). ⛔ **A lift to a NEW FILE would red this walker** — see §11 |
| ⛔ **NOT a golden for this claim** | `tests/domain/advanceWorkerByteIdentity.test.js` | `:116-117` | Compares `sync` to `structuredClone(sync)` — **both sides run the same code**, so it is a RELATIVE transport pin | ⛔ **Named so it is not counted as protection.** It would stay green if the ruin shape changed |
| ⭐ **THE golden that DOES cover this** | `tests/simulation/presetLightingWitness.test.js` + `tests/fixtures/preset-lighting-witness-golden.json` | the per-preset row hashes | Its header: *"⚠ THIS IS A BYTE GOLDEN OVER THE WHOLE PULSE. It moves when the pulse moves"*; each row hashes **52 interior one-week ticks** of world pulse; *"THIS SURFACE HAS NO CAPTURE ARM AND NO ENV SPELLING, AND THAT IS DELIBERATE"* | ⭐ This **confirms** §6's key-order premise. A4 asserts it unmoved; it cannot be quietly re-recorded |
| **Test precedent** | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q — the institution founding year')` (`:113`) + **seven** straight-line `it` | One literal `describe`, no `.each`/nesting, positive control first | Copy this proof shape (§P3.4) |
| **Oracle precedent** | `tests/domain/calamity.kernel.integration.test.js` | `runStrike` (`:110`) + `struckOf` (`:125`) | Drives `advanceCalamity` with a controlled rng and reaches **both** ruin arms — `:146` (collapse, site `:282`) and `:170`/`:173` (destroy, site `:286`) | A1's oracle copies this driver |

**Forbidden alternatives:** ⛔ **no second writer of the ruin shape** — that is the whole packet;
⛔ **no change to the five keys, their values for the calamity call, or their ORDER**; ⛔ no edit to
`convergence.js` or any other hot file; ⛔ **no lift of the function OUT of `calamityKernel.js`**
(§11); ⛔ no `worldPulseFate` vocabulary minted (R2); ⛔ no widening of `EntityStatus` (addendum 6);
⛔ no re-pointing of the four other ruin-adjacent paths, nor of the 28 test fixtures (R7); no files
outside the manifest.

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

⛔ **THE RETURNED SHAPE, EXACT AND IN THIS KEY ORDER** — the order is the existing literal's and is
load-bearing, because the preset witness hashes serialized pulse records (**confirmed from that
instrument's own header**, §5):

```js
({ ...inst,
   status: 'ruined',
   _worldPulseInactive: true,
   _worldPulseEconomyClosed: true,
   worldPulseFate: fate,
   remnantReason: reason })
```

⛔ **`fate` and `reason` are BOTH REQUIRED. Neither has a default.** A defaulted `fate` would let a
caller silently stamp `destroyed_by_disaster` on a record no disaster touched — which is the exact
lie this packet exists to make impossible. An absent, empty or non-string `fate` or `reason` is a
**throw**, not a coerced value: this is a pulse writer, and a silently-wrong history is worse than a
crash at the call site (the `rngContext` fail-closed precedent).

**The two callers, by value:**

| caller | `fate` | `reason` |
|---|---|---|
| the calamity path (this packet, both sites) | `'destroyed_by_disaster'` — **passed explicitly**, not defaulted | the site's existing string, **verbatim** |
| the DM's decree (**EM-B1a**, later) | `'ruined_by_decree'` | the decree's own cause, from the removal pool |

### ⛔ A7's MATCHER, STATED EXACTLY — the obvious implementation is VACUOUS

A7 claims `status: 'ruined'` is written in exactly one place in `src/`. **Measured three ways over
2,246 non-test `src/**` files** (evidence §12):

| strip | hits | why |
|---|---:|---|
| **raw bytes** | **4** | three are JSDoc prose *describing* the shape (`defenseInstitutionBuckets.js:41`, `institutionStatusModel.js:29,:303`, `defenseGenerator.js:38`) |
| the estate's shared **`codeOnly`** (`tests/helpers/codeOnlySource.js`) | **0** | its own docblock: it *"blanks comments AND string/template CONTENTS"* ⇒ `'ruined'` → `'      '`. ⛔ **WRONG TOOL — a lane reaching for the shared helper writes a vacuously-green arm** |
| ⭐ **comment-only strip (KEEPS string contents)** | **1** | `src/domain/worldPulse/calamityKernel.js` — the truth |

⛔ **The arm MUST use a comment-only strip** (blank `//` and `/* */`, skip over string/template
literals without blanking them), matcher `/status:\s*'ruined'/`, scanning `src/**/*.{js,jsx}`
excluding `*.test.*`. Both controls are **required, not optional**: the matcher must be proved to
fire on a planted second writer and proved to ignore a commented one (both verified live by the
pre-proof lane). ⓘ The `src/` scope is deliberate — `tests/` holds 28 legitimate hand-built fixtures
(R7).

**Purity and lifecycle.** `ruinInstitution` is pure: it reads no world, draws no random number,
reads no clock, and **never mutates `inst`** (the existing arrow already spreads; A5 asserts the
input unmutated by deep-equal against a pre-call clone). Nothing is persisted by this packet that
was not persisted before — **the shape already exists on saved records**, so no migration, no
observed-shape door and no veil change is owed.

**Golden posture: ⛔ UNCHANGED, and it is the packet's central claim rather than a footnote.** The
calamity call must produce a record **byte-identical** to today's, so `generatorGoldenMaster`,
`dossierProseManifest` and **the preset witness** cannot move. A1 executes the byte-equality
directly; A4 executes the hashes.

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/worldPulse/calamityKernel.js` | `ruin` → `export function ruinInstitution`; the two call sites at `:282`, `:286` | **≤20 eff total; ≤3 per site** | Lift the private arrow to an exported **module-level** function taking `{ reason, fate }`, preserving the five keys **and their order**; both sites pass `fate: 'destroyed_by_disaster'` and their existing reason verbatim. ⛔ Do not touch `:274`'s demotion branch or `:816`'s prose key. ⛔ **The function stays IN THIS FILE** (§11). |
| `CREATE` | `tests/domain/ruinInstitution.test.js` | A1–A7 | `n/a` | ONE literal `describe`, **seven straight-line `it`**, no `.each`/`runIf`/nesting (§P3.4). Negatives carry `// anchored:` on the line immediately above (the anchor walker's `SCAN_ROOTS = ['tests']` covers this path). |

Generated artifacts: `NONE`. ⭐ **And that is a MEASUREMENT, not an omission** — see the edge-shared
row below.

### The registration ledger — every row priced against the tip

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — `+1 file`, INTERIOR RED** | ⛔ **NO ABSOLUTE IS QUOTED** (this packet floats). The DELTA, derived from its own CREATE row — one file, one literal `describe`, seven straight-line `it` — is **`+1 files / +0 parked / +1 credited / +7 titles / +1 suiteTitles`**. Corroborated against EM-B1d's independently-derived `+1/+0/+1/+4/+1` for the same shape with four `it`. The absolute is **stamped by the chair at promotion from the live baseline**; the host train's terminal re-derives the tuple whole. |
| P2.2 | mutation-coverage row | **NOT OWED — EXECUTED** | ⭐ Run against the estate's own enumerator with a positive control: `tests/domain` is **not** one of the eight `ENFORCER_DIRS`, and `ruinInstitution.test.js` matches **none** of `NAME_PATTERN`'s sixteen tokens (`false`), while the control `sovereigntyLightingContract.walker.test.js` returns `true`. ⇒ `scripts/mutation-coverage-manifest.json` is **NOT in this manifest**, so this packet **contends with nobody** for it (its only live non-terminal reserver is EM-B1d) and its ability to FLOAT is unaffected. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key (`dmLayer`, `decrees`) is read, and **no new stored key is minted** — the five already exist on saved records. ⚠ One `src/` file moves and the scanner covers every `.js` under `src/`, so the check is in `checks` and **motion is a STOP**. |
| P2.4 | writer-reach | ⚠ **MEASURE AND RECORD — never write** | Baseline captured at §8 step 1; the lane **records the verdict** and writes no baseline. The edit is a refactor with no new property read, so no motion is expected — a prediction, not a claim. A **shrink is banked by the CHAIR** through the instrument's own door; **GROWTH is a STOP.** |
| P2.5 | decision-fork / mechanism-coverage | **NOT OWED** | No seeded chooser, no pool, no draw — the function is deterministic and total. |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |
| ⭐ | **edge-shared closure (§P2 row 10)** | ⭐ **NOT OWED — MEASURED TWICE. R3 CLOSED.** | The law is real and is what STOPPED EM-B1d: `node scripts/build-edge-shared.mjs` re-stamps `generatedAt` in **all five** metas in one window (`:82-83`), so an owing packet declares **seven** generated paths — confirmed from precedent landings (`ddcfb1f59`, `ee8ac6c3c`, `58b466afc`: 7 files each). **It does not apply here.** *Method A:* `calamityKernel.js` appears in **0 of 405** inputs across the five committed metas. *Method B (independent, in case a meta is stale):* a static+dynamic graph walk from each of the five **entries** — returning a strict **superset** of each meta (76/2/125/2/126 vs 74/2/114/2/115) — reaches it from **none**. ⇒ **No rebuild, no generated path, and the seven `_shared` paths are NOT shared with EM-B1d v5.** |
| ⭐ | **bundle budgets (§P2 row 11)** | ⭐ **NO BUDGETED CHUNK — no TEST row, no build step** | Measured by import-graph walk (static AND static+dynamic) and by the repo's **own** `computeEagerModuleGraph` (`vite.config.js:248-274`, copied verbatim). **Generation worker** (`WORKER_BUNDLE_CEILING_BYTES = 1401208`, EXACT/zero slack): **NOT REACHABLE** (220/228 modules). **Lazy engine** (`< 679_000`, ~870 B): **NO** — the chunk rule is `id.includes('/src/generators/')` (`vite.config.js:862`) and this file is `src/domain/worldPulse/`. **First-paint eager closure**: **NO** (243 modules; `pulseKernel` and `advanceInterval` also absent). **`advanceInterval.worker`**: ⭐ **YES**, statically, 3 hops — **and it has NO ceiling today.** ⇒ Under the brief's step 5 the packet **carries no budget obligation**. Bytes priced anyway for sequencing: **+270 B minified** (esbuild, the edited region), of which **+85 B** is A3's required-argument guard and **+185 B** the unavoidable structure (an exported name cannot be mangled). ⭐ **TOOL-3 will mint that ceiling — see R6 for the order.** |
| ⭐ | **declared-command write set (brief step 11)** | **CLEAN** | Every command in `checks` was read for what it WRITES. `check-observed-shape-readers.mjs` and `check-writer-reach.mjs` are invoked as **readers** (no `--write`); no declared command runs a generator. ⇒ **no undeclared path is written by this packet's own seal.** |
| ⭐ | **`tests/` sweep (brief step 12)** | **NO TEST PATH OWED** | Swept by LITERAL, not field name. `ruined_by_decree`: **absent from `src/` and `tests/`**. `ruinInstitution`: absent from both (only EM-B1d's prose names it). `destroyed_by_disaster`: **exactly one occurrence repo-wide** (`calamityKernel.js:252`) — no fixture, no pin. The retired `ruin` is module-private and importable by nothing. **No exact pin on `INACTIVE_STATUSES`** in either direction; **no export-surface pin** on the MODIFY target. ⚠ 28 `status: 'ruined'` fixture sites exist in `tests/` but all **hand-build** the shape and none imports the writer, so none moves — recorded as the drift class **R7**. |

> ⛔ **THE CENSUS ROW IS DEFERRED (§417 shape)** — no edit; the manifest omits the path.
> Predicted interior red, SHAPE ONLY (the absolute is the chair's):
> `the estate's file count moved — re-measure, do not re-word: expected <N> to be <N-1>`.

---

## 8. Ordered coding sequence

0. Dispatch and seal; re-read `git rev-parse HEAD` in the same command; re-confirm disjointness
   (R8: has EM-B1d touched `src/domain/entities/status.js` since the base was stamped?).
1. **Capture the baselines.** ⓘ The pre-proof lane measured items (a)–(b); re-take them as
   **confirmation** on a shared tree, not as discovery.
   (a) `max-lines` of `calamityKernel.js` with eslint's own `Linter` (`skipBlankLines`,
   `skipComments`) — **expect ≈453 against the 800 ceiling** (§3.1); (b) the five census figures;
   (c) `sha256` of `tests/fixtures/generator-golden-master.json` **and of
   `tests/fixtures/preset-lighting-witness-golden.json`**; (d) `node scripts/check-writer-reach.mjs`;
   and ⭐ (e) **the pre-edit ruin record** — the oracle A1 compares against.
   ⛔ **THE ORACLE CANNOT IMPORT THE WRITER**: both `ruin` (`:250`) and its enclosing
   `applyStrikeToRoster` (`:222`) are module-private. Drive the exported `advanceCalamity` (`:567`)
   with a controlled rng, copying `tests/domain/calamity.kernel.integration.test.js`'s `runStrike`
   (`:110`) + `struckOf` (`:125`), and keep `JSON.stringify` of the ruined institution **for both
   arms** — the collapse site `:282` (that suite's `:146`) and the destroy site `:286` (`:170`).
2. Add `tests/domain/ruinInstitution.test.js` with A1–A7 **failing**.
3. Lift the arrow to `export function ruinInstitution(inst, { reason, fate })` **at module level in
   this same file**, keys and order preserved, with the two required-argument throws.
4. Re-point the two call sites, each passing `fate: 'destroyed_by_disaster'` and its existing reason
   verbatim. ⛔ Rename by hand at the three sites; do not sweep (`:816` is a prose key).
5. Wire consumers: **NOT APPLICABLE** — EM-B1a is the second consumer and lands later. Skip and
   record.
6. Registrations: none owed (§7). The prevention guards are A1's byte-equality arm and A7's
   single-writer scan.
7. Run focused verification (§10), including the writer-reach comparison against step 1 and
   ⭐ **`tests/lint/ruinFilterRoster.walker.test.js`** (§11's coupling).
8. Run the wave-end gate per the host train's plan; write the completion receipt.

---

## 9. Acceptance matrix

| ID | Case | Required observation |
|---|---|---|
| **A1** | **⛔ BYTE-EQUALITY — the packet's whole claim, and the guard** | The record the calamity path produces after the refactor is **`JSON.stringify`-identical** to the pre-edit record captured at step 1 — the same five keys, the same values, **in the same order**. Asserted for **BOTH** call sites (`:282`'s collapse arm and `:286`'s destroy arm), driven through the exported `advanceCalamity` since the writer is unreachable. ⭐ Guard-the-guard: the oracle string is asserted non-empty and to contain `"status":"ruined"` **before** the equality, so the arm cannot pass on an empty capture. |
| **A2** | **The DM's fate and cause flow through** | `ruinInstitution(inst, { reason: "Razed by the table's hand.", fate: 'ruined_by_decree' })` returns `status: 'ruined'`, `_worldPulseInactive: true`, `_worldPulseEconomyClosed: true`, `worldPulseFate: 'ruined_by_decree'`, `remnantReason: "Razed by the table's hand."` — the decree's own words, with **no disaster vocabulary anywhere in the record**, asserted by name. |
| **A3** | **Both arguments are required; absence THROWS** | A missing `fate`, a missing `reason`, an empty string, a non-string of either, and a bare `ruinInstitution(inst)` each **throw** — never a coerced value and never a silent `destroyed_by_disaster`. Anchored by the valid call in the same arm, so the negatives cannot pass on a broken import; every negative carries `// anchored:` on the line above. |
| **A4** | **⛔ THE PULSE'S HISTORY DOES NOT MOVE** | `generatorGoldenMaster` and `dossierProseManifest` are bytewise unchanged, **and the preset witness is unmoved** — asserted as the digests of `tests/fixtures/generator-golden-master.json` and ⭐ `tests/fixtures/preset-lighting-witness-golden.json` before and at the tip. ⓘ The witness is the instrument that actually covers this path: it hashes 52 interior ticks of world pulse and **has no capture arm**, so a move cannot be quietly re-recorded. ⛔ `advanceWorkerByteIdentity` is **not** counted here — it compares the code to itself. |
| **A5** | **Purity, and the input unmutated** | `inst` is proved unmutated against a pre-call clone (deep-equal), the function returns a NEW object (`not.toBe`), identical inputs give `toEqual` results, and 100 calls change nothing observable. |
| **A6** | **⭐ THE DECREE FATE IS INERT AT ITS CONSUMERS — by sufficiency, proved not asserted** | Through the **REAL** functions, with a disaster-ruined control beside the decree one: `rosterProvenance`'s fate/cause read (`:258-259`) returns the decree's fate and cause as **free text**, and `causeLifecycle.institutionDestroyed` (`:137`) answers `true`. ⭐ **THE SUFFICIENCY ARM:** the same record with `worldPulseFate` **deleted** still answers `true` — because `_worldPulseInactive` decides at `:139` and `'ruined'` decides again at `:141`. That is what proves `ruined_by_decree` needs no vocabulary row: not merely that the readers do not branch on it, but that **its value can never change a verdict.** |
| **A7** | **One writer, and the exclusion honoured** | A source scan proves **`status: 'ruined'` is written in exactly one place in `src/`** — `ruinInstitution`. ⛔ **The matcher is fixed by §6: a COMMENT-ONLY strip that keeps string contents** (the estate's shared `codeOnly` returns **zero** here and a raw scan returns **four**). Both controls required: the matcher is proved live on a **planted second writer**, and proved to **ignore a commented one**. ⛔ And the import fence: `calamityKernel.js` neither imports nor references `src/domain/worldPulse/convergence.js`, asserted in both directions. |

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

# The calamity kernel's own suites + the ruin-filter family — ⭐ RESOLVED BY THE PRE-PROOF LANE
# (version 1 named none and left this to the implementer; these are measured importers).
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/calamity.test.js tests/domain/calamity.kernel.integration.test.js \
  tests/domain/ruinFilter.probe.test.js tests/domain/institutionStatusModel.test.js

# ⭐ THE COUPLING §11 FOUND — this walker's only compliance token in the edited file is the moved line.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/ruinFilterRoster.walker.test.js tests/lint/negativeAssertionAnchor.walker.test.js

# ⭐ THE GOLDENS THAT ACTUALLY COVER THE PULSE — the preset witness is named, not implied.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js \
  tests/simulation/presetLightingWitness.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/check-writer-reach.mjs            # compare against step 1's baseline; RECORD, never --write
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B1e
npm run implementation:resume -- EM-B1e
```

Expected: every command exits `0`, **except** the named census interior red until the host train's
terminal. ⛔ Never read a gate through a shell pipe (§P7). ⛔ Never wrap `npm run check` in the mutex.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: the seal is missing or foreign; HEAD is not
the stamped base or a descendant proved non-interfering; **A1's byte-equality fails by one
character** — that is history moving, and no repair is attempted in-packet; a golden, the prose
manifest or **the preset witness** moves; `check-writer-reach` shows **growth**;
`check-observed-shape-readers` moves; a **second** writer of the ruin shape appears necessary; the
five keys, their calamity values or **their order** would have to change; `:274`'s demotion branch
or `:816`'s prose key appears to need editing; **`convergence.js` or any other hot file appears to
need touching**; a `worldPulseFate` vocabulary appears necessary (R2 — a different member);
`EntityStatus` appears to need widening (addendum 6 forbids it).

⭐ **THE `max-lines` STOP IS DISCHARGED, NOT DELETED.** Version 1 stopped if headroom was under 20
lines. **Measured: 453 effective against a ceiling of 800 — 347 lines of headroom** (§3.1). Step 1
re-confirms; a *measured* figure above 780 is still a STOP.

⛔⛔ **AND THE ESCAPE HATCH IT USED TO OFFER IS NOW A TRAP — DO NOT TAKE IT.** Version 1's cure for
that STOP was *"the function moves to its own leaf."* **Measured: `tests/lint/ruinFilterRoster.walker.test.js`
enrols `calamityKernel.js` as a roster reader (`READER_RE = /\.institutions\b/` over `codeOnly`),
and its ONLY compliance evidence is the token `_worldPulseInactive` at `:251` — the exact line this
packet moves.** The file does not import `institutionRoster`. Lifting the writer **within the file**
keeps the token and the walker stays green; lifting it to a **new file** strips
`calamityKernel.js`'s last compliance token and **REDS that walker**, while the new leaf would
itself need enrolling or exempting — a register act. ⇒ ⛔ **If the function must leave this file,
the packet RETURNS TO THE CHAIR.** The walker is in §10 so the green is executed, not assumed.

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · **the pre-edit `max-lines` headroom of
`calamityKernel.js`** and the post-edit figure (expect ≈453 → ≈463 of 800) · exact changed files and
effective-line deltas · **the captured pre-edit ruin record and the post-edit record, both quoted,
proved identical, for BOTH call sites** · acceptance A1–A7 executed · ⭐ **A7's hit list quoted
whole, with the matcher named and both controls' results** · the mutants planted, convicted and
restored digest-exact (§P6) · focused commands, exits and counts · the writer-reach comparison
against step 1 (**recorded, not written**) · ⭐ **`ruinFilterRoster.walker` green, with the
compliance token's new line number** · sealed per-step receipt and resume status · both typecheck
configurations · gate stages actually executed · base-versus-wave failure identity diff ·
dormancy/golden result **and the preset witness digest** · census tuple before and at the tip with
the interior red quoted verbatim · ⭐ **the measured minified byte delta of the edited region, for
TOOL-3's ceiling (predicted +270 B)** · edge-shared closure verdict: **NOT OWED, and no
`supabase/functions/_shared/**` path written** · deviations `NONE | STOP` · out-of-scope
observations without investigation · **judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | ✅ **CONFIRMED AT THE TIP. The ruling's conditional is answered NO: `worldPulseFate` has no closed vocabulary** — no typedef enumerating it (the two that mention it declare `unknown` and `string`), no table, no walker, and no reader that branches on a value. `ruined_by_decree` is priced at **zero** and is absent from `src/` and `tests/` entirely. Confirm the reading. |
| **R2** | ⚠ **A fate vocabulary with no closure is where a ninth spelling lands unnoticed.** Eight sites write free strings today. Minting a closed vocabulary with a totality walker would be a real improvement — and it is a register act over eight existing writers, **not this packet's**. Docket it, or accept the openness on record. |
| **R3** | ✅ ⭐ **CLOSED BY MEASUREMENT — the edge-shared rebuild is NOT OWED.** Proved twice: `calamityKernel.js` is in **0 of 405** inputs across the five committed metas, and an independent graph walk from each of the five entries — a strict superset of each meta — reaches it from none. The seven-path law is real (it STOPPED EM-B1d; precedent `ddcfb1f59` et al.) but does not apply here. Version 1's §11 STOP is deleted. **No chair action needed beyond noting the closure.** |
| **R4** | **`institutionStatusModel.js` carries a FOURTH institution vocabulary** — `INSTITUTION_STATUSES = ['operational','impaired','shell']` (`:99`) — distinct from both `EntityStatus` and the pulse's ruin set. Found while measuring; **not investigated, not in scope**, and recorded so it is not discovered as new by whoever next touches institution status. |
| **R5** | ⚠ **THE CHARTER'S EM-T3 ROW IS STALE PROSE.** It still reads *"the vocabulary widening: `jailed` **and `ruined`** into the two typedefs"*, but EM-B1d v4 narrowed to `jailed` and routed the institution-state contract to **EM-B1a** (its §2a), leaving only the shared ruin **writer** here. Nothing is owed — `ruined` already exists as the pulse's literal and `EntityStatus` must not be widened — but the charter row should be corrected so a later reader does not re-derive a typedef obligation. **Flagged, not adjudicated.** |
| **R6** | ⭐ **SEQUENCING vs TOOL-3 — the chair's call.** `calamityKernel.js` is in the **`advanceInterval.worker`** bundle, which has **no ceiling today**; TOOL-3 is queued to mint one. This packet adds a measured **+270 B minified** (+185 B structural, +85 B A3's guard). The ceiling law is MONOTONE-DOWN ⇒ **if TOOL-3 mints FIRST, this packet forces a ceiling re-mint (a chair act with attribution); if EM-B1e lands FIRST, TOOL-3 simply measures the post-B1e figure and nothing is owed.** ⇒ **RECOMMEND: land EM-B1e before TOOL-3.** Not adjudicated here. |
| **R7** | ⚠ **28 HAND-BUILT REPLICAS OF THE RUIN SHAPE LIVE IN `tests/`** (~18 files; `ruinFilter.probe.test.js:27` even calls itself *"the exact calamityKernel.ruin stamp"*, and `magicForms.test.js:307` spells all three flag keys). None imports the writer, so **none moves with this packet** and no TEST row is owed — but the moment this packet lands there is a canonical writer they could route through, and until they do they will drift from it. **Docket as a follow-up; it is a test-side change in a different behaviour family.** |
| **R8** | ⚠ **ORDER vs EM-B1d v5 — confirm at placement.** The packets are disjoint in their change manifests, and this one owes no `_shared` path, so the seven edge-shared paths are **not** shared. But EM-B1d v5 may home its new vocabulary in `src/domain/entities/status.js`, which is a `requiredSymbols` path here and therefore part of this packet's dispatch **substrate** — any EM-B1d landing that touches it invalidates this packet's stamped base. Since the base is stamped at promotion anyway, the cure is order: **EM-B1d lands first; EM-B1e is placed after.** Confirm. |
| **R9** | ⛔ **A REVERSIBLE ACT JOINED TO AN IRREVERSIBLE CONSEQUENCE — for EM-B1a, not this packet.** `causeLifecycle.institutionDestroyed` treats a ruined institution as permanently destroyed, **severing an NPC's criminal leash** (`:131-133`). That is correct for a disaster (THE PROMISE makes it irreversible). A **DM decree** is an authored act, and if a decree-ruin is ever undoable, undo must also restore those leashes. This writer is agnostic — but the question must not be discovered at EM-B1a's build. **Docket onto EM-B1a.** |

### THE CHAIR'S ANSWERS AT PROMOTION (2026-09-19; ODQ §934.47 addendum 24)

**R1** confirmed — this packet adds the writer with `fate` a REQUIRED argument; it mints no spelling. **R2** DOCKETED as **EM-B1h** (the fate vocabulary closed: one frozen `WORLD_PULSE_FATES` and a totality walker over its writers), chartered to land BEFORE EM-B1a makes `ruined_by_decree` producible — FINITE-SEMANTICS is the estate's law and an open vocabulary is where a ninth spelling lands unnoticed. **R4** goes to EM-B1a's pre-proof (the fourth institution vocabulary in `institutionStatusModel.js`). **R5** the charter's stale EM-T3 row is corrected in the same ledger commit. **R6** is moot twice over: this packet lands first, and TOOL-3's ceilings carry a declared headroom ratcheted per train. **R7** DOCKETED as a test-side parallel lane (FIX-T1: route the 28 hand-built ruin replicas through the writer). **R8** REVERSED — this packet lands first (header). **R9** DOCKETED onto EM-B1a's compile as a binding measurement: a decree-ruin joins an authored act to an irreversible consequence (criminal leashes sever), so the op's undo and the tick's event semantics must each say what becomes of the leashes.
