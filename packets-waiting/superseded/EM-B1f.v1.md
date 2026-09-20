# `settlement editor / wave 1` — EM-B1f: status-based absence at THE ONE PARTICIPATION CHOKEPOINT

- **Status:** `BLOCKED` — ⛔ **on EM-B1k's landing, nothing else.** §13's two defects are now
  CONFIRMED by execution and chartered as **EM-B1k** (*"nothing permanent is decided from, and
  nothing is persisted out of, the participation view"*); the chair ruled (Q10) that this packet
  does **not** narrow its arm and lands after that cure with all three members. Every other section
  is compiled to READY and needs no further work.
- **Packet version:** `2`
- **Verified base:** `__BASE__`
- **Last revalidated:** `__BASE__`
- **Depends on:** **EM-B1d, LANDED at `95e494bdb`** (version 5) · ⛔ **EM-B1k** (chartered
  2026-09-19, not yet landed — the participation-view cure; see §13 and
  `RECON-STAGE.report.md`)
- **Collision group:** `NONE` — measured: no non-terminal packet reserves any of this packet's twelve paths (§7.1)
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — the chokepoint's body; the full seven-site consumer census; every `.status` writer in `src/`; the 525-row golden corpus by execution; the seat read's live verdict; **the filtered-view call graph reproduced through the real pulse**; the four chunk closures and the FORM B import edge; the edge-shared write set by generator AND by precedent; the line-addressed and stamped registers
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

## 0. WHAT VERSION 2 CHANGED, AND WHY

Version 1 was compiled against a tip where **EM-B1d had not landed**, and it landed as **version 5
with a different shape than the packet v1 read**: `ROSTER_ABSENT_STATUSES` is byte-identical to
before, and a NEW availability vocabulary `NPC_UNAVAILABLE_STATUSES` (`entities/npcs.js`) carries
`jailed`. Version 2 re-measures everything at `e5bdfd031` and applies the chair's seven rulings:
the arm's members are **`exiled`, `jailed`, `removed`** (Q1); the form is the chair's **derived
FORM B**, re-priced at **+184 B** once measured as a *specifier on the import `state.js` already
has* (Q4); the edge-shared obligation is **seven paths with action `MODIFY`**, not four as
`REGENERATE` — `PACKET_ACTIONS` has no such action (step 11); the generator moves **last** in
`checks` (step 14a); titles are priced only after checking each home's opener (step 14b); and the
line-addressed and stamped registers are measured (steps 13, 15).

⛔ **And it carries the answer to the measurement the chair owed before promotion, which is why
the status is BLOCKED rather than DRAFT.** The participation filter reaches an irreversible
consumer, and **two pre-existing defects were reproduced through the shipped pulse, today, with no
arm of this packet in the tree.** §13 is the whole of it.

---

## 1. Reconciled authority

1. **The owner, design §15 (ODQ §934.46):** *"A jailed or exiled holder cannot keep a seat."*
2. **The chair's rulings of 2026-09-19 on this packet's v1 compile** — Q1 the arm is
   `exiled · jailed · removed`, never `missing`/`retired`; Q2 the lazy engine's ~700 B margin is a
   raise-time convention and the literal assertion is the law; Q3 price `advanceInterval.worker`
   as a DELTA, no per-packet re-mint; Q4 FORM B, derived; Q5 the ninth roster row is this
   packet's; Q6 discharged; Q7 the double refusal is the settled idiom.
3. **The charter**, amendments of 2026-09-19 16:0x (EM-B1f chartered) and 17:0x (train **EM-T6**,
   this packet FIRST because it ⛔ **BLOCKS EM-B1a's promotion**).
4. **EM-B1d version 5's own law, inherited verbatim** (`entities/npcs.js` header above
   `NPC_UNAVAILABLE_STATUSES`): *"`jailed` is UNAVAILABLE but still ON the roster… **Participation
   is a THIRD question, cured once at `isOffStage` (roads/state.js §8) by EM-B1f.**"*
5. **`DESIGN_THE_ROADS.md` §8** and **§1 law 5** — travel is narrative, captivity is mechanical.
6. **`EM-PREAMBLE.md` §P2 rows 10–11**; the pre-proof brief's steps 11–15.

### §1.1 · Resolved contradictions — three, each measured

- v1's *"`ROSTER_ABSENT_STATUSES` gains `jailed`"* reading → **withdrawn**: EM-B1d v5 left that
  constant untouched and minted `NPC_UNAVAILABLE_STATUSES` instead. Evidence §12.
- v1's four `REGENERATE` rows → **invalid**: `PACKET_ACTIONS` is
  `['CREATE','DOC','MODIFY','REGISTER','TEST']`. Seven `MODIFY` rows now. Evidence §16.
- the chair's *"derived … minus `dead`"* → **the walker forbids a `union-read` row for it**,
  because subtracting `dead` requires spelling `'dead'`, a TRIGGER word, and no exported constant
  holds it. The row is therefore `literals`/`enumerator: false`, the shape its three siblings
  already use. Evidence §15. **Measured, not chosen.**

The implementer does not read other documents to reinterpret this packet.

---

## 2. Outcome

**Observable result:** an NPC whose `status` is `exiled`, `jailed` or `removed` is OFF-STAGE for
every participation read, so a jailed or exiled holder cannot keep a seat.

**Definition of done:** `isOffStage` returns `true` for those three; the seven existing consumers
inherit it unchanged; `readWarSeatBooks` reads `unseated` for a jailed ruler exactly as it already
does for a dead, shelved or hostage one; **and no irreversible consumer acts on the widening**
(§13's ruling, once given).

In scope: ONE arm on ONE predicate; integration by *inheritance* (no consumer is edited); the
prevention guard is EM-B1d's walker, which this packet joins as its ninth roster row.

Explicit non-goals: ⛔ `missing` and `retired` never join the arm (Q1). ⛔ No writer —
`set-npc-status` is EM-B1a's. ⛔ No holder guard, op, store surface, component or flag. ⛔ No edit
to `NPC_UNAVAILABLE_STATUSES`, `ROSTER_ABSENT_STATUSES` or any EM-B1d file. ⛔ **No cure of the
§13 findings** — this packet does not repair what it did not cause.

---

## 3. Hard scope budget

| Limit | Packet budget | This packet |
|---|---:|---:|
| Behavior families | `1` | **1** |
| New persisted record families · Named state writers · Feature flags · User-facing surfaces | `0 or 1` | **0 · 0 · 0 · 0** |
| Direct consumers | `<=2` | **0 new** (seven inherit) |
| New logic-bearing production leaves | `<=2` | **0** |
| Existing logic-bearing production files modified | `<=3` | **1** |
| Additional registration-only files | `<=3` | **1** |
| Handwritten files total | `<=12` | **5** |
| New/changed effective production lines | `<=400` | **≤6** |
| Delta in a shared/hot file | `<=15` | n/a — §3.1 |
| Acceptance cases | `<=8` | **7** |

Overrides approved before dispatch: `NONE`.

### §3.1 · Hot files — measured; the one file edited is NOT hot

`src/domain/roads/state.js` = **288 effective lines** under eslint's own `Linter`
(`skipBlankLines`, `skipComments`) against the `src/domain/**` ceiling of **800**
(`eslint.config.js:710-712`): **512 lines of headroom**, no per-file override, no
`scripts/.size-baseline.json` entry, on none of `PACKET_STANDARD.md`'s five standing hot rows.

### §3.2 · ⭐ THE BUNDLE BUDGETS, PRICED (§P2 row 11)

| budget | ceiling | member? | cost | obligation |
|---|---:|---|---:|---|
| generation worker `WORKER_BUNDLE_CEILING_BYTES` | `1,401,208` — ZERO slack | **NO** (220-module closure) | **0 B** | none |
| eager first paint `EAGER_FIRST_PAINT_MODULES` | closure budget | **NO** (`roads/state.js` absent; both importers absent) | **0 B** | none |
| lazy `engine` chunk | `< 679_000` | ⭐ **YES** | **+184 B measured**, bound **≤370 B** | §8's byte step |
| `advanceInterval.worker` | ⛔ none today; **TOOL-3 mints one with a 4 KB per-TRAIN headroom** | ⭐ **YES** (549-module closure) | **a +184 B DELTA against that headroom** | ⛔ **no per-packet re-mint (Q3)** |
| `townSceneExport` · `townScene` · `customContentPreview` workers | — | **NO** | **0 B** | none |
| edge-shared bundles | INPUT membership | ⭐ **YES — input of both** | 7 paths | §3.3 |

**The bytes, measured, not estimated** (both forms written over the real file, minified with the
repo's own esbuild): base `7,727 B`; **FORM A** (three literals spelled here) `7,885 B` = **+158 B**;
**FORM B as a second import statement** `7,946 B` = +219 B; ⭐ **FORM B as a SPECIFIER on the
import `state.js` already has** `7,911 B` = **+184 B — CONTRACTED**.

⭐ **THE IMPORT IS NOT A NEW EDGE.** `state.js:36` already reads
`import { importanceWeight } from '../entities/npcs.js';`. Measured: `entities/npcs.js` is already
in the `advanceInterval.worker` closure; its own closure is 2 modules and **does not reach**
`roads/state.js` (no cycle); **0 modules are added to any closure.** So FORM B's whole cost over
FORM A is **+26 B of code**, and it buys a single source of truth for the vocabulary.

⚠ **HONEST LABEL:** `+184 B` is **CONFIRMED** as a minified-source delta, **PLAUSIBLE** as the
rendered-chunk delta (esbuild is not Rollup's renderer). Hence the ×2 bound.

Under **Q2** the lazy engine's `< 679_000` literal is the law between re-mints; the build lane
measures at this packet's own base and asserts growth ≤370 B with only `roads/state.js` moved.

### §3.3 · ⛔ THE EDGE-SHARED OBLIGATION — SEVEN PATHS, established two ways

`src/domain/roads/state.js` is an INPUT of both `aiCharterBundle` (114 inputs) and
`aiOutputSchemaBundle` (115) — membership, never entry-hood (§P2 row 10). `build:edge-shared` runs
`scripts/build-edge-shared.mjs`, whose **five** entries each re-stamp `generatedAt` in one window
(`:83`, `:108`), so a run that moves two bundles writes **7 paths**: 2 bundles + their 2 metas +
the 3 siblings' re-stamped metas. Confirmed by precedent: EM-B1d's own landing `95e494bdb` and
`ee8ac6c3c` each show **7 files changed** under `supabase/functions/_shared`. Both methods were
used, as step 11 requires.

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1f
```
Check by check, at a base set to the tip: **branch/ancestry** — `head === verifiedBase`, the
substrate arm returns early; **substrate** — no `REGISTER` row is declared, so no declared-substrate
file sits in the window; **CREATE targets absent** — there is **no CREATE row**, so the check is
vacuous; **non-CREATE targets clean** — twelve pre-existing paths; **required symbols resolve** —
the eight rows of §5, each `grep -cF` = 1 at `e5bdfd031`.
**`node scripts/implementation-packets.mjs validate`** now passes on placement: EM-B1d is LANDED
(terminal) and **no non-terminal packet reserves any of the twelve paths** (measured).

⛔ **The packet may not be dispatched at all while §13 is unruled.**

---

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **The chokepoint** | `src/domain/roads/state.js` | `export function isOffStage` (`:157`) | `isInStasis(npc) \|\| whereabouts.state === 'hostage'`; **never reads `.status`**. Pure, total, absence-safe. | THE one place the arm is added. |
| **Inherited predicate** | `src/domain/npc/npcOps.js` | `export function isInStasis` (`:151`) | `!!(npc && typeof npc === 'object' && npc.stasis)`; its vocabulary is `STASIS_REASONS`, a per-layer fact, **not** `NpcStatus`. | Preserve; build beside it. |
| **The availability vocabulary** | `src/domain/entities/npcs.js` | `export const NPC_UNAVAILABLE_STATUSES` (`:105`) | `Object.freeze(['dead','exiled','jailed','removed'])`; its header names EM-B1f as the cure for the participation question. | ⭐ **The arm DERIVES from it** (FORM B). Never re-spelled. |
| **Sole seat read** | `src/domain/worldPulse/warSeatBooks.js` | `function rosterNpcById` (`:92`) — ⛔ **module-private** | `:102` pairs `=== 'dead'` with `isOffStage`. | Preserve UNEDITED — the widening ARRIVES here. |
| **Exported route to it** | `src/domain/worldPulse/warSeatBooks.js` | `export function readWarSeatBooks` (`:618`) | calls it at `:633`; `!rulerId \|\| !ruler` returns `securityBand:'unseated'`, `seatWeight01:0`, omits `rulerId`. | A1 observes through it. |
| **Master gate** | `src/domain/worldPulse/worldSnapshot.js` | `export function buildWorldSnapshot` (`:94`) | `:127-129` filters off-stage NPCs out of the settlement every pulse kernel reads; the RAW save roster is untouched. | A4 observes through it. ⛔ **And it is the source of §13.** |
| ⛔ **The irreversible consumer** | `src/domain/density/factionLifecycle.js` | `export function factionRosterOf` (`:113`) | `:117` filters `settlement.npcs` by `isOnRoster`; an empty roster **dissolves the house permanently** (R18). | ⛔ **Named so §13 cannot be lost.** Not edited. |
| **Prevention guard** | `tests/lint/statusUnionTotality.walker.test.js` | `const CONSUMER_ROSTER` (`:124`) | eight rows; `spelling` is CHECKED, not trusted; its `CHOKEPOINT` constant already says *"status-based absence joins that chokepoint in EM-B1f, not here"*. | ⛔ Gains this packet's ninth row. |
| **Test precedent** | `tests/domain/warSeatBooks.test.js` | `it('never lets a dead roster holder keep deciding through a stale top rung')` | asserts `interestKind:'realm'`, `settlementWeight01:1`, `seatWeight01:0`, `securityBand:'unseated'`, `rulerId` undefined. | ⭐ A1 copies this shape verbatim with `'jailed'`. |
| **Test precedent** | `tests/domain/roadsState.test.js` | `describe('roads state — isOffStage …')` (`:30`) | four straight-line `it`s. | A2/A3 extend it; no new `describe`. |

Forbidden alternatives: no second participation predicate or status vocabulary; ⛔ **no edit to any
of the seven consumers**; ⛔ no edit to any EM-B1d file; no new `worldState` key, PRNG stream, time
source or writer; no files outside the manifest.

---

## 6. Exact contracts

### The predicate, after this packet — the whole diff, verbatim (FORM B, the chair's)

```js
// at :36 — a SPECIFIER on the import this file already has; not a new module edge
import { NPC_UNAVAILABLE_STATUSES, importanceWeight } from '../entities/npcs.js';
```
```js
/**
 * The statuses that put a person OFF-STAGE, DERIVED from the availability vocabulary so this
 * file never spells the union a third time (entities/npcs.js owns it; EM-B1d v5's law).
 * `dead` is subtracted because the three seat/ladder consumers pair `=== 'dead'` themselves.
 */
export const OFF_STAGE_STATUSES = Object.freeze(
  NPC_UNAVAILABLE_STATUSES.filter((s) => s !== 'dead'),
);

export function isOffStage(npc) {
  if (isInStasis(/** @type {Parameters<typeof isInStasis>[0]} */ (npc))) return true;
  const o = npc && typeof npc === 'object' ? /** @type {Record<string, unknown>} */ (npc) : null;
  if (o && OFF_STAGE_STATUSES.includes(String(o.status || '').toLowerCase())) return true;
  const w = o ? o.whereabouts : null;
  return !!(w && typeof w === 'object' && /** @type {Record<string, unknown>} */ (w).state === 'hostage');
}
```
⛔ **The declaration line `export function isOffStage(npc) {` is unchanged byte-for-byte.**
⛔ **`OFF_STAGE_STATUSES` evaluates to `['exiled','jailed','removed']` — asserted by A2, never
re-spelled in this file.** A member added to `NPC_UNAVAILABLE_STATUSES` later joins the arm
automatically; that is the point of deriving, and A2 pins the current value so the widening is
never silent.

### Inputs, outputs, absence

- **absent `status` key** ⇒ `''` ⇒ **on-stage** — the case the corpus made load-bearing (4,884 of
  5,171 generated NPCs carry no `status` key);
- **`null` / `undefined` npc** ⇒ `false`, exactly as today (`roadsState.test.js:45` pins it);
- **non-string `status`** ⇒ `String(...)` coerces; `0`, `false`, `null` ⇒ `''` ⇒ on-stage;
- **`'JAILED'`** ⇒ lowercased ⇒ off-stage, matching `warSeatBooks:102` / `npcLadderState:205` /
  `npcLadderKernel:660`;
- **unknown token / empty string** ⇒ on-stage. The predicate never guesses.

### Ordering · determinism · flag · dormancy · golden posture

Stasis first (unchanged), then status, then hostage — a disjunction, so the order is not
observable; fixed so a future arm is one block. No hash/fork key, no draw, no rounding. **Flag:
NONE** — the arm is deliberately outside `roadsActive`, as `isInStasis` already is. **Dormancy:
presence-driven** — a world with no such NPC evaluates one `includes` on a 3-member frozen array
and behaves identically, including `buildWorldSnapshot` returning the SAME settlement reference
(A5). **Golden posture: UNCHANGED**, a measured claim: 0 of 5,171 NPCs across the full 525-row
corpus carry any of the three, and no writer in `src/` can produce one.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| nothing | a READ of an existing union member | nothing | unchanged | unchanged — generation writes none | unchanged | ⛔ unchanged: an imported or forked save reads identically, the predicate being pure over the record | ⛔ unchanged — the veil reads the SAVE, not the participation view, so the jailed person still appears in the dossier as jailed |

### Receipts, privacy, alignment, edit story

No receipt; no rendered figure (⇒ prose-numerics NOT owed); no DM-only field; projection
unchanged. Alignment **DECLARED EMPTY**. Edit story **ENGINE-ONLY** — the DM's route is EM-B1a's.

### ⛔ The behaviour change, stated so it can be refused

A world holding an NPC stored as `exiled` or `removed` changes its reading the moment this lands.
**Measured: no writer in `src/` can assign either to `.status`** — the six writers are `createNpc`
(default `'active'`, pass-through), `killNpc` (`'dead'`), `assignNpcToRole`, `factionRoles`'s
synthesis, `mintTiedPractitioner` and the undo helper (all `'active'`), and `addNpc` enumerates
its fields without forwarding `event.payload.status`. ⇒ **inert by construction on every world
that exists.** `jailed` becomes producible only with EM-B1a, which this packet blocks.

⛔ **THE EXCEPTION IS §13, AND IT IS WHY THIS PACKET IS BLOCKED.**

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/roads/state.js` | `isOffStage` (`:157`), import (`:36`) | **+6 eff** | §6 verbatim. Declaration line byte-identical. ⛔ Stales two edge bundles — see the seven rows. |
| `MODIFY` | `tests/lint/statusUnionTotality.walker.test.js` | `CONSUMER_ROSTER` (`:124`) | **+2 eff** | ⛔ **THE NINTH ROW**, shape forced by the walker (evidence §15): `{ file: 'src/domain/roads/state.js', symbol: 'isOffStage', spelling: 'literals', enumerator: false, omits: ALL_BUT_DEAD, why: … }`. The `why` must be ≥40 chars and must say: *"THE PARTICIPATION CHOKEPOINT ITSELF. It spells only `'dead'`, and only to SUBTRACT it: the members it acts on — exiled, jailed, removed — are DERIVED from NPC_UNAVAILABLE_STATUSES and never spelled here, so `omits` lists words this file does not write rather than words it ignores. `missing` and `retired` are genuinely excluded: a reversible absence keeps the place (R18)."* ⛔ Nothing else in the walker is touched. |
| `TEST` | `tests/domain/roadsState.test.js` | the `isOffStage` describe (`:30`) | `n/a` | A2 + A3 — **one** new straight-line `it`. No new `describe`. |
| `TEST` | `tests/domain/warSeatBooks.test.js` | beside the dead-holder case | `n/a` | A1 — **one** new straight-line `it`. |
| `TEST` | `tests/domain/roadsParticipation.test.js` | the master-gate describe | `n/a` | A4 + A5 + A7 — **two** new straight-line `it`. ⛔ Do not touch the `.npcs` inventory ratchet. |
| `MODIFY` | `supabase/functions/_shared/aiCharterBundle.js` | whole artifact | `n/a` | ⛔ Written by `npm run build:edge-shared`, **LAST** in `checks`. Never hand-edited. |
| `MODIFY` | `supabase/functions/_shared/aiCharterBundle.meta.json` | whole artifact | `n/a` | same run |
| `MODIFY` | `supabase/functions/_shared/aiOutputSchemaBundle.js` | whole artifact | `n/a` | same run |
| `MODIFY` | `supabase/functions/_shared/aiOutputSchemaBundle.meta.json` | whole artifact | `n/a` | same run |
| `MODIFY` | `supabase/functions/_shared/aiGroundingBundle.meta.json` | `generatedAt` | `n/a` | ⛔ A SIBLING re-stamped by the same window (step 11). Declared so the seal does not drift. |
| `MODIFY` | `supabase/functions/_shared/analyticsEventsBundle.meta.json` | `generatedAt` | `n/a` | same |
| `MODIFY` | `supabase/functions/_shared/intentAtlasBundle.meta.json` | `generatedAt` | `n/a` | same |

**Generated artifacts:** ⛔ **SEVEN**, all by `npm run build:edge-shared`, never by hand.
⛔ **No CREATE row. No REGISTER row. Exactly four new `it` and no new `describe`.**
⛔ **`REGENERATE` is not a `PACKET_ACTIONS` member** — every generated row is `MODIFY`.

### §7.1 · Placement — measured, and free

`TERMINAL_PACKET_STATUSES = {LANDED, SUPERSEDED}` (`implementation-packets.mjs:43`);
`reservesChangePaths = !TERMINAL.has(status)` (`:676`). At `e5bdfd031`: **EM-B1d is LANDED**,
**EM-B1f is not in the 190-entry register**, and **no non-terminal packet reserves any of the
twelve paths**. Version 1's Q6 hazard is discharged.

### §7.2 · The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — titles only** | All four homes import their opener from `'vitest'`, so none is parked `OPENER_UNRESOLVED` and every new `it` is a **credited** title (step 14b). ⛔ NO ABSOLUTE QUOTED. DELTA: **`+0 files / +0 parked / +0 credited / +4 titles / +0 suiteTitles`**. The chair stamps the absolute. |
| P2.2 | mutation-coverage row | **NOT OWED** | The packet CREATEs nothing under `ENFORCER_DIRS`; the walker's `invariants` row is EM-B1d's and already landed. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key read. The estate's baseline holds **zero** `status on …` rows although dozens of files already read `.status`, so the arm adds none (PLAUSIBLE). ⚠ the scanner is in `checks`; **motion is a STOP.** |
| P2.4 | writer-reach | ⚠ **MEASURE, DO NOT ASSUME** | Baseline captured at step 1; a shrink is `--write`, **growth is a mint and a CHAIR act**. |
| P2.5 · P2.7 | fork / prose-numerics | **NOT OWED** | No draw; no figure. The prose-numerics baseline does not name this file (measured). |
| P2.10 | edge-shared freshness | ⛔ **OWED — §3.3** | Seven paths. |
| P2.11 | byte budgets | **PRICED — §3.2** | +184 B into the lazy engine; a DELTA against TOOL-3's 4 KB per-train headroom for `advanceInterval.worker`; zero into the worker and first paint. |
| **step 13** | line-addressed registers | **NOT A RED — named** | `tests/lint/.tuning-inventory.json` carries `"src/domain/roads/state.js#ROADS_TUNING": { "line": 222, "spanDigest": … }` and this edit sits ABOVE it (`:157`), so the line goes stale — but `tuningRegister.walker.test.js` keys on **`spanDigest`** and pins this exact case (*"a comment inserted above the table must leave the digest where it was — the line-address hazard is deliberately NOT re-planted here"*). No manifest row; §12.1 records it. |
| **step 15** | stamped files | **NOT OWED** | `docs/content/wiring-census.json` `stamp.files` has 7 entries and **does not name this file** (measured). No re-take. |

---

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. ⛔ **Do not begin while §13 is unruled.**
1. **Capture the baselines before the first edit:** `check-writer-reach`,
   `check-observed-shape-readers`, the engine chunk's size from a real build through the exclusive
   mutex, and the kit's per-module attribution.
2. **Reproduce and add the failing tests.** ⭐ Run A1's fixture FIRST and observe
   `securityBand:'holding'`, `seatWeight01:0.3744`, `rulerId:'a:ruler'` for a jailed ruler (this
   lane executed it — evidence §5 of v1). If it does not reproduce, **STOP**.
3. **Implement the arm** — §6 exactly, in `src/domain/roads/state.js`, and nothing else.
4. **Join the walker's roster** — the ninth row and its reasoned omission only. Confirm green;
   delete the row locally and confirm it REDS by name; restore.
5. **Run focused verification** (§10), then the byte step: a real build through the mutex,
   per-module attribution showing **only `src/domain/roads/state.js` moved**, growth ≤370 B, the
   engine chunk `< 679_000`.
6. ⛔ **LAST: `npm run build:edge-shared`**, then confirm exactly SEVEN `_shared` paths moved and
   record both `sourceHash` transitions. It re-stamps declared paths, so nothing may follow it.
7. Write the completion receipt.

```text
1. isInStasis(npc)                                            ⇒ off-stage
2. o := (npc is a non-null object) ? npc : null
3. OFF_STAGE_STATUSES.includes(String(o?.status||'').toLowerCase())  ⇒ off-stage
4. w := o ? o.whereabouts : null ; w?.state === 'hostage'      ⇒ off-stage
5. otherwise                                                   ⇒ on-stage
```

---

## 9. Acceptance matrix

| ID | Case | Required observation | Test home |
|---|---|---|---|
| **A1** | ⭐ **THE SEAT LAW, EXECUTED (design §15).** | A jailed ruler through `readWarSeatBooks` → `interestKind:'realm'`, `settlementWeight01:1`, `seatWeight01:0`, `securityBand:'unseated'`, `rulerId` undefined — identical to the landed `dead` case. ⛔ **Anchored:** an `active` ruler in the same arm reads `holding`, `0.3744`, `a:ruler`. | `tests/domain/warSeatBooks.test.js` |
| **A2** | **THE ARM, EXACT AND DERIVED.** | `OFF_STAGE_STATUSES` equals `['exiled','jailed','removed']` and is frozen — so a widening of `NPC_UNAVAILABLE_STATUSES` reds here rather than changing behaviour silently. `isOffStage` TRUE for the three (and `'JAILED'`); ⛔ **FALSE for `active`, `dead`, `missing`, `retired`, an unknown token, `''`, a non-string, and a record with NO `status` key.** The `missing`/`retired` rows are what pin Q1. | `tests/domain/roadsState.test.js` |
| **A3** | **REGRESSION ANCHOR** — travel is still narrative. | The four existing `it`s read as before. **No new title.** | `tests/domain/roadsState.test.js` |
| **A4** | ⛔ **ABSENCE FROM PARTICIPATION IS NOT ABSENCE FROM THE RECORD.** | `buildWorldSnapshot` excludes a jailed NPC from the participation view **and** `save.settlement.npcs` still contains them by id. | `tests/domain/roadsParticipation.test.js` |
| **A5** | **DORMANCY** — zero allocation. | The existing `plain` fixture still yields the **same settlement reference**. **No new title.** | `tests/domain/roadsParticipation.test.js` |
| **A6** | ⛔ **NOTHING MOVES.** | Both golden suites bytewise unchanged. Proved, not argued: 0 of 5,171 corpus NPCs carry any of the three, and no `src/` writer can produce one. Run via `checks`; no new title. | `tests/property/…` |
| **A7** | ⭐ **THE WALKER'S NINTH ROW, GUARDED.** | The walker is green with the row; **deleting it REDS by name**; the guard-the-guard arm ("a roster file must still contain a trigger token") passes on `'dead'`. | `tests/domain/roadsParticipation.test.js` drives it; the walker's own suite proves the red |

Seven of ≤8.

---

## 10. Verification commands

```sh
npx eslint src/domain/roads/state.js tests/domain/roadsState.test.js \
  tests/domain/warSeatBooks.test.js tests/domain/roadsParticipation.test.js \
  tests/lint/statusUnionTotality.walker.test.js
npm run typecheck:ratchet && npm run typecheck:domain:strict

npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/roadsState.test.js tests/domain/roadsParticipation.test.js \
  tests/domain/warSeatBooks.test.js tests/domain/warSeatTermination.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/lint/statusUnionTotality.walker.test.js
# ⛔ GOLDEN POSTURE — must not move
npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js
# ⛔ THE §13 FAMILY — the density lane's own pins, run because this packet feeds it
npx vitest run --pool=threads --maxWorkers=2 \
  tests/generators/densityLaw.test.js tests/domain/advanceWorkerByteIdentity.test.js

node scripts/check-observed-shape-readers.mjs      # motion is a STOP
node scripts/check-writer-reach.mjs                # shrink = --write; growth = a chair act
node scripts/implementation-packets.mjs validate

# ⛔ ABSOLUTELY LAST — it re-stamps declared paths; nothing may follow it
npm run build:edge-shared
```

---

## 11. Mandatory STOP conditions

1. ⛔ **§13 is unruled.** The packet does not start.
2. ⛔ The defect does not reproduce at step 2 (a jailed ruler already reads `unseated`).
3. ⛔ `NPC_UNAVAILABLE_STATUSES` is not `['dead','exiled','jailed','removed']` at the base.
4. ⛔ Either golden suite moves, or `tests/generators/densityLaw.test.js` reds.
5. ⛔ `check-writer-reach` or `check-observed-shape-readers` **grows**.
6. ⛔ Engine growth exceeds 370 B, any module other than `src/domain/roads/state.js` moved, the
   engine lands ≥ `679_000`, or any worker ceiling reds.
7. ⛔ The walker demands anything beyond one roster row.
8. ⛔ Any consumer needs an edit — the whole premise is inheritance through one chokepoint.
9. ⛔ Fewer or more than SEVEN `_shared` paths move.
10. ⛔ The delta in `state.js` exceeds 6 effective lines, or a file outside the manifest must change.

---

## 12. Completion receipt

Record, with executed output: the step-2 reproduction both ways; the seven consumer sites
re-confirmed **unedited** by diff; both golden suites and the density suite; the seven `_shared`
paths and both `sourceHash` transitions; writer-reach and observed-shape before/after; the byte
step (engine before/after, per-module attribution, worker readings); the lighting DELTA actually
caused (`+4 titles` predicted) **as a delta**; the walker's red when the ninth row is removed.

### §12.1 · NOTICED, NOT TOUCHED — each specific enough to slot

1. ⛔⛔ **F-2 — a shelved or hostage LAST MEMBER dissolves its house permanently, today**
   (§13). Slot: a cure packet **before** EM-B1f, in train EM-T6.
2. ⛔⛔ **F-1 — the tick's WRITTEN settlement loses every off-stage person, with all density laws
   dormant** (§13.3). Larger and independent. Slot: its own packet; the one unexecuted hop
   (whether the store re-merges before persisting) is the first thing it measures.
3. ⚠ **The participation ratchet cannot see the reader that bit.**
   `tests/domain/roadsParticipation.test.js:308` greps only `src/domain/worldPulse` and
   `src/domain/spatial`; the `.npcs` read lives at `src/domain/density/factionLifecycle.js:117`.
   Slot: widen the scan roots — a one-line change plus the dispositions it surfaces.
4. ⚠ **`factionDensityKernel.js` sits in that census's EXPECTED list (`:139`) with no disposition
   comment**, so it inherits the blanket "via-snapshot, protected by the gate" reading — which is
   precisely wrong for a consumer with a permanent consequence. Slot: with item 3.
5. ⚠ **`tests/lint/.tuning-inventory.json`'s `line: 222` for `ROADS_TUNING` goes stale** with this
   edit. Not asserted (the walker keys on `spanDigest`), so it re-takes with that file's next
   regeneration. No action owed.
6. ⚠ **`src/generators/density/titularSuccession.js` is DARK** — `factionRosterOf` at `:177`/`:231`
   with **no importer in `src/`**. It will read whatever settlement its future caller passes; the
   §13 ruling should be written into it before it is wired.
7. ⚠ **`tests/property/npcs.property.test.js:40`** asserts the status is one of five, omitting
   `removed` and `jailed`; it cannot red because its arbitrary never generates a `status`. A
   vacuous arm worth one line when someone is next in that file.

---

## 13. ⛔⛔ BLOCKED — THE FILTERED VIEW REACHES AN IRREVERSIBLE CONSUMER

**The premise this packet was built on is sound; the CONSEQUENCE of the chokepoint is not what the
charter assumed.** `buildWorldSnapshot` does not merely hide an off-stage person from participation
— its filtered settlement object is the base the tick's writes are built from, and one consumer
turns an empty roster into **permanent house dissolution**.

**The call graph** (evidence §13.1): `pulseKernel` builds every update entry from
`item.settlement` (`buildSettlementMap:178-188`, fed by `buildWorldSnapshot` at `:1506`) →
`advanceFactionDensity` reads `item.settlement` as `tickStart` and calls `readFactionLifecycle` on
it (`:704`) → `factionRosterOf` filters by `isOnRoster` (`factionLifecycle.js:117`) → an empty
roster is `dissolved` (`:130`). The `stillEmpty` **confirmation** at `:262` — written precisely so
*"an irreversible consequence may only fire on a fact that is still true"* — reads `fresh`, which
descends from the **same filtered view**, so it cannot save the house.

**Reproduced through the shipped pulse, today, with no arm in the tree** (evidence §13.2–§13.3):

| run | sole Weaver | houses after | roster in the written settlement | beat |
|---|---|---|---|---|
| A | active (control) | `["The Crown","The Weavers"]` | both | — |
| **B** | **`stasis`** | ⛔ `["The Crown"]` | one | `faction_dissolved` |
| **C** | **`hostage`** | ⛔ `["The Crown"]` | one | `faction_dissolved` |
| D | `status:'jailed'` | `["The Crown","The Weavers"]` | both | — *(inert only because `isOffStage` does not yet read `.status`)* |

⛔ **EM-B1f's arm moves row D onto row B.** `exiled` and `removed` are irreversible, so dissolution
is arguably correct for them; **`jailed` is REVERSIBLE — "a verdict ends" — and routing it into a
permanent consequence is EM-B1d version 4's defect one level down.**

And with **every density law dormant**, B and C still lose the person from the written settlement
(F-1) — a defect that does not need R18 at all.

**Two candidates were named in the brief. This lane chooses neither:**
(a) the irreversible consumers read the **RAW** roster; (b) the filter keeps **reversible**
absences visible, under a flag.

⚠ **A third possibility the measurement raises, offered as data:** F-1 and F-2 may share one cure
(the write-side settlement descending from the raw roster rather than the view), in which case (a)
is a special case of it. **The chair rules.**

### The questions that remain

- **Q8 — the walker's `omits` field reads backwards under FORM B.** The row is lawful, but it
  lists `exiled, jailed, removed` as "omitted" when they are exactly what the arm acts on (they
  are derived, not spelled). Should the walker gain a `spelling: 'derived'`? Evidence §15.
- **Q9 — does the store re-merge the raw roster before persisting?** The one hop this lane could
  not execute (it needs the store, not plain `node`). It decides F-1's severity.
- **Q10 — does the §13 cure land before EM-B1f, or does EM-B1f narrow its arm to `exiled` and
  `removed`** (both irreversible, both already absent to R18) **and wait for the cure before
  admitting `jailed`?** The second is buildable today and keeps EM-T6 moving; it is a charter
  change, so it is not this lane's to take.
