# `simulation / participation` — EM-B1k2: the irreversible reads take the RAW roster by construction, and the habitat is removed

- **Status:** `DRAFT`
- **Packet version:** `1`
- **Verified base:** `fixes-2026-09-18-consist` at `__BASE__`
- **Last revalidated:** `__BASE__` — the chair stamps this at placement. ⛔ **THIS PACKET MAY NOT BE PLACED UNTIL EM-B1k IS `LANDED`**, and its pre-proof re-runs at that tip: EM-B1k's own §7 `TEST` row edits `tests/domain/roadsParticipation.test.js`, this packet's `TEST` row edits the same file, and `PACKET_STANDARD.md` ("Validator status-sequence simulation") reserves a change path at **every non-terminal status, DRAFT included** — so both live at once reds `validate:packets`. Its whole contract is also *defence behind EM-B1k*: every figure below was measured with EM-B1k's raw write base modelled in memory.
- **Depends on:** `EM-B1k` — **must be LANDED**, not merely READY (§0).
- **Collision group:** `EM-B1k` — `tests/domain/roadsParticipation.test.js`. No other packet: of the 190 manifest entries, only `EP-3A`, `EP-3B` (both `LANDED`, `roadsKernel.js`) and `EM-B1d` (`LANDED`, `factionLifecycle.js`) name any path here.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — the `tickStart` read and its two consumers; the `fresh` fallback; the two permanent roster writers driven at their real triggers; the reachability of both of them; the widened ratchet's exact new conviction; the four chunk closures of every candidate file; the edge-shared input membership; the line-addressed and stamped registers; the size ceilings of all four production files; the `tests/` fixture sweep
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1` — stamped by the chair at placement; measured identical in the read tree and at the branch tip `07cc2efb6`)

> **REVALIDATION SENTENCE for the chair:** *"Revalidated at `<tip>`: EM-B1k is LANDED at `<sha>` and `buildSettlementMap`'s write base is raw; `factionDensityKernel.js`'s `tickStart` still reads `item.settlement` verbatim at one site and `item` is read nowhere else in `advanceFactionDensity`; `readFactionLifecycle` still consumes only `governed` and `reactions` there; `foundReaders` still greps exactly `src/domain/worldPulse` and `src/domain/spatial`; the widened root still convicts exactly `src/domain/density/factionLifecycle.js`; the four production files measure 395 / 462 / 50 / 838 effective lines; all sixteen `requiredSymbols` resolve EXACTLY ONCE; the CREATE target is absent; no non-terminal packet reserves a change path."*

---

## 0. Scope, and why this packet exists at all

EM-B1k made the tick's **write base** the raw save roster — two single-line replacements in `pulseKernel.js` — and that alone stops both defects. This packet removes the **habitat**, and the habitat is measured, not feared:

1. ⛔ **`factionDensityKernel`'s lifecycle read is still filtered.** `tickStart` (`:699`) is `asObject(item.settlement)` — the participation view. Under EM-B1k the dissolution reaction is still **PRODUCED** from it and merely **REFUSED** downstream by `stillEmpty` over the raw `fresh`. Measured over a 7-town corpus stride: **the reaction is produced 7 / 7 from the filtered read and 0 / 7 from the raw one** (evidence §3). An irreversible decision computed from a projection and rescued by a second guard is one edit away from firing.
2. ⛔ **The refusal depends on an unpinned invariant.** `fresh` FALLS BACK to `tickStart` when the update entry carries no `.settlement` (`:721-723`). Driven with such an entry, the shelved sole member's house is dissolved **7 / 7** even with EM-B1k's raw write base (evidence §4). Nothing in the tree pins "every update entry carries `.settlement`"; `buildSettlementMap` happens to.
3. ⛔ **The `.npcs` reader census asserts a protection that does not exist.** `settlementLifecycleFirstClass.js` and `successorNpc.js` sit in `EXPECTED` with **no disposition**, inheriting the file's blanket *"everything else is via-snapshot (protected by the gate, no edit)"* (`:73`). Both are permanent roster writers whose base is **their caller's choice**, and handed the filtered view both **DROP the off-stage soul** — measured, executed, both directions (evidence §5).

---

## 1. Reconciled authority

1. **The chair's ruling of 2026-09-20 (ODQ §934.60 addendum 2, Q1)** — EM-B1k's split is confirmed; EM-B1k2 removes the habitat: the irreversible consumers read RAW explicitly, the permanent roster writers are cured with the class, and the participation ratchet widens to `src/domain/density`.
2. **The chair's ruling of 2026-09-19** — *"the participation view is a READ projection and must never be the WRITE base."*
3. **`DESIGN_THE_ROADS.md` §8** — the ONE participation chokepoint is a *participation* filter. ⛔ Every REVERSIBLE reading keeps it.
4. **§810.4 R18** (`factionLifecycle.js`, the `ROSTER_ABSENT_STATUSES` docblock) — *an IRREVERSIBLE consequence may only be triggered by IRREVERSIBLE causes.*
5. **The tree's own confirmation comment** (`factionDensityKernel.js:258-262`).
6. **The tree at the verified base**, measured — every row of §5.

### §1.1 · Resolved contradictions — three, measured, each against a stated premise

| premise carried into this compile | measured verdict |
|---|---|
| *"`factionDensityKernel.js` carries no disposition comment and inherits the blanket"* (RECON-STAGE §2.1) | ⚠ **HALF FALSE.** The row at `:139` **does** carry a disposition — `TE-DENSITY-1`, and it is about `applyCadence`'s raw read of `fresh` **only**. The `tickStart` lifecycle read is what inherits the blanket. The cure is a SECOND clause on the existing comment, never a new row. |
| *"`settlementLifecycleFirstClass.js:611` and `successorNpc.js:66` are currently unreachable"* (RECON-STAGE §2.1) | ⛔ **FALSE, BOTH.** `settlementLifecycleEnabled` is a `WAVES` virtual key lit in **all four presets including the default** `realistic_regional`; `advanceNpcCorruption` — the sole producer of `kind: 'ousted'` — is called **unconditionally** at `pulseKernel.js:388`. Both lanes are LIVE; their arms are therefore driven at REAL triggers (A5, A6), not at a function boundary. |
| *"the two permanent roster writers must read RAW explicitly"* (the launch's outcome 2, as worded) | ⛔ **NOT EXPRESSIBLE.** Neither function receives a save: `applySettlementLifecycleOutcomeToSettlement(settlement, outcome)` and `replaceOustedNpcs(settlement, oustedNames, rng)` have no raw roster in hand. Their base is their caller's, and both callers — `applyWorldPulse.js:733` (from `buildSettlementMap`) and `npcVerdictPulse.js:133` (from `localSettlements`) — are made raw **by EM-B1k**. The cure available here is therefore the CONTRACT (a comment-only base declaration), the CENSUS DISPOSITION and the PIN. **§13 Q1 puts this to the chair.** |

---

## 2. Outcome

**Observable result:** no permanent consequence in the density lane is ever **computed** from the participation view — not merely refused after the fact — and every reader that writes permanent roster state carries a written statement of which roster it is handed, enforced by a census that now reaches `src/domain/density`.

**Definition of done:** a shelved sole member's house is never even PROPOSED for dissolution; the `fresh` fallback can no longer dissolve it either; the widened ratchet convicts exactly one new file and it is dispositioned; the dispersal and the successor pass each carry the off-stage soul at their real triggers; and **nothing else moves at all** — the chain's output is byte-identical to EM-B1k's (measured, evidence §3).

In scope:

1. one primary behaviour — the lifecycle read's base;
2. one required integration — the census's roots and four dispositions;
3. one prevention guard — the widened ratchet plus the red-first suite.

Explicit non-goals: ⛔ no change to `isOffStage`, to `worldSnapshot`'s filter, or to any REVERSIBLE reading (arrivals, emergence founders, marks keep the participation view — the roads design's one chokepoint is not reopened). ⛔ No repair of already-damaged saves (EM-B1k §12.2). ⛔ No change to `pulseKernel.js` — EM-B1k owns that file. ⛔ No identity-join cure for `replaceOustedNpcs`'s name matching (§12.1 item 3). ⛔ No editor packet work.

---

## 3. Hard scope budget

| Limit | Budget | This packet |
|---|---:|---:|
| Behavior families | `1` | **1** |
| New persisted record families · writers · flags · surfaces | `0 or 1` | **0 · 0 · 0 · 0** |
| New logic-bearing production leaves | `<=2` | **0** |
| Existing logic-bearing production files modified | `<=3` | ⭐ **1** (three further rows are ⛔ COMMENT-ONLY — **§13 Q1**) |
| Additional registration-only files | `<=3` | **0** |
| Handwritten files total | `<=12` | **6** |
| New/changed effective production lines | `<=400` | ⛔ **0** |
| Effective lines per new leaf | `<=250` | **≤250** (the one new test file) |
| Delta in a shared/hot file | `<=15` | **0** |
| Acceptance cases | `<=8` | **8** |

### §3.1 · Effective lines and ceilings — executed, at the verified base

All four figures from eslint's own `Linter` under `max-lines` with `skipBlankLines: true, skipComments: true` (evidence §6):

| file | effective | governed by | headroom | this packet |
|---|---:|---|---:|---:|
| `src/domain/worldPulse/factionDensityKernel.js` | **395** | `max-lines` 800 (`src/domain/**`) | 405 | **+0** (one-line-for-one-line) |
| `src/domain/worldPulse/settlementLifecycleFirstClass.js` | **462** | `max-lines` 800 | 338 | **+0** (comment only) |
| `src/domain/worldPulse/successorNpc.js` | **50** | `max-lines` 800 | 750 | **+0** (comment only) |
| ⛔ `src/domain/worldPulse/roadsKernel.js` | **838** | `scripts/.size-baseline.json` = **838** | ⛔ **0, BOTH DIRECTIONS** | **+0** (comment only) |

⛔ **`roadsKernel.js` is tolerance-zero in both directions** and the estate already knows it: LANDED packet `EP-3A`'s own `requiredSymbols` note reads *"this file sits at exactly its frozen 838, tolerance-zero in both directions, so an own-line import would red eslint and a shrink would red sizeBaseline"*. A comment is the **only** lawful edit into it, and `max-lines`' `skipComments` makes it free. None of the four is on `PACKET_STANDARD.md`'s standing hot-file list as it stands at this tip (`EconomicsTab.jsx`, `OutputContainer.jsx`, `convergence.js`, `institutionLifecycle.js`, `peaceTerms.js`, `informationStatecraft.js`).

### §3.2 · Bundle budgets, priced — every chunk closure measured with vite's own edge reader

| budget | ceiling | members among this packet's `src/` paths | cost |
|---|---:|---|---:|
| generation worker `WORKER_BUNDLE_CEILING_BYTES` | `1,401,208` — ⛔ ZERO slack | ⭐ **NONE of the four** (220-module closure, measured) | ⛔ **0 B, proven by the import graph** |
| eager first paint `CLOSURE_BUDGET_BYTES` | `1,048,000` raw (gzip `337,000`, Brotli `283,000`); last figure recorded in the test's own header is **1,047,205** ⇒ **≈795 B of margin**, and raises are **OWNER-SIGNED** | ⭐ **`successorNpc.js` ONLY** — `main.jsx → store/index.js → settlementSlice.js → events/mutateEntities.js → successorNpc.js` (4 hops). `factionDensityKernel.js`, `roadsKernel.js`, `settlementLifecycleFirstClass.js` are **NOT** eager | ⛔ **0 B REQUIRED.** The `successorNpc.js` row is COMMENT-ONLY and the build strips comments, so the rendered module must not move **one byte**. ⛔ The comment carries no `/*!`, `@license` or `@preserve` token (those survive minification). A non-zero attribution for this module is a **STOP** — the first-paint budget is the owner's, not the chair's. |
| lazy `engine` chunk | `< 679_000`; last measured **678,131** ⇒ **869 B of margin** | `factionDensityKernel.js` (main-graph member: not eager, not in the worker closure) | **≈0 B** — one token-level replacement, no new import. Bounded at **≤ 200 B** (the added source text ×2), proven by attribution. |
| `advanceInterval.worker` | ⛔ none today; TOOL-3 mints one with **4 KB per-train headroom** | **all four** (549-module closure) | **a DELTA, ≈0 B; no per-packet re-mint** (the chair's Q3 ruling, recorded at EM-B1k §3.2) |
| edge-shared bundles | INPUT membership against the five metas' own `inputs` | ⭐ **NONE** — 0 hits across `aiCharterBundle` (114 inputs), `aiGroundingBundle` (74), `aiOutputSchemaBundle` (115), `analyticsEventsBundle` (2), `intentAtlasBundle` (2) | ⛔ **no rebuild, no `_shared` rows, and NO GENERATOR in `checks`** — §P2.12's seven-path hazard does not arise |

⛔ **THE BUILD LANE'S STEP, because two budgets are near-full.** After the edits: one real `npm run build` through the exclusive mutex; the kit's per-module attribution (`tools/attrib.config.mjs`, RENDERED lengths; it reads main-graph chunk sizes 742 B low); **ONLY `factionDensityKernel.js` may show any movement at all, and `successorNpc.js` must show ZERO**; then `tests/build/vendorPdfLazy.test.js` and `tests/build/generationWorkerLazy.test.js` green against the fresh `dist` (both arms are `skipIf(!requireDistRead)` — they measure nothing without a build). Any rise in the first-paint closure is a **STOP for the chair and the owner**; no ceiling is re-minted by this packet.

### §3.3 · Registers — measured, all five

`scripts/.size-baseline.json` — §3.1 (`roadsKernel.js` 838; the other three carry no row). `docs/content/wiring-census.json` `stamp.files` holds **7 entries**, all under `src/domain/display/stateProse/` — **none of the four** ⇒ ⛔ **no re-take**. `tests/lint/.prose-numerics-baseline.json` names **none of the four** (`grep -c` = 0) and this packet renders no figure. `tests/lint/.tuning-inventory.json` holds rows for three of them, but `tuningRegister.walker.test.js` keys on `spanDigest` and pins in terms that *"a comment must not move a digest"* (`:212-213`) and *"a comment inserted above the table must leave the digest where it was"* (`:428-430`) ⇒ ⛔ **not a red**. ⛔ **No `src/` file in the estate cites any of the four by `path:line`** (`git grep -n "<path>:[0-9]"` over `src`, `docs/content`, `tests` → **zero hits, all five paths**) ⇒ step 16 clean, no citation re-address owed.

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1k2
```

**branch/ancestry** — `head === verifiedBase`, the substrate arm returns early. **substrate** — no `REGISTER` row, so nothing declared sits in the window. **CREATE targets absent** — one CREATE (`tests/domain/irreversibleRawRoster.test.js`), absent and untracked at the base (measured). **non-CREATE targets clean.** **required symbols resolve** — the sixteen rows of §5, each `grep -cF` = **1** (evidence §7). `node scripts/implementation-packets.mjs validate` passes **only once EM-B1k is LANDED**: until then EM-B1k reserves `tests/domain/roadsParticipation.test.js` and two non-terminal packets on one path red the validator by construction.

Any mismatch makes this packet STALE. Stop before coding. Edit only exact-manifest paths.

---

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| ⭐ **The read that must change** | `src/domain/worldPulse/factionDensityKernel.js` | `export function advanceFactionDensity` | `const tickStart = item && item.settlement ? asObject(item.settlement) : null;` (`:699`) — the FILTERED view. `item` is read at **exactly one other place** in the function (`itemById.get(sid)`, `:698`); there is no second `item.` read in the loop | THE one line that changes. |
| **Its only two consumers** | `src/domain/worldPulse/factionDensityKernel.js` | `readFactionLifecycle(tickStart, { tick })` (`:704`) and the `fresh` fallback (`:721-723`) | `reading` is consumed for `governed` (`:714`) and `reactions` (`:732`) **and nothing else** — `reading.census` has no consumer here | Both become raw together; that is the whole change. |
| ⭐ **The law** | `src/domain/density/factionLifecycle.js` | `export function readFactionLifecycle` | returns `{governed, census, reactions}`; a `dissolved`/`ruling_interregnum` state mints a reaction | Preserve. A1 proves the reaction is not minted once its base is raw. |
| **The roster filter** | `src/domain/density/factionLifecycle.js` | `export function factionRosterOf` | filters by `isOnRoster`; consumed by `stillEmpty` (`:262`) over `fresh` | Preserve; it was right all along. |
| **The vocabulary** | `src/domain/density/factionLifecycle.js` | `export const ROSTER_ABSENT_STATUSES` | `Object.freeze(['dead','exiled','removed'])` — EM-B1d's LANDED byte-identical pin | ⛔ Untouched. |
| ⭐ **The raw roster, already on the item** | `src/domain/worldPulse/worldSnapshot.js` | `export function buildWorldSnapshot` | every item carries `save`; the participation view is `{ ..._s, npcs: filtered }` (`:127-129`) — a shallow copy differing from `saveSettlement(save)` in `npcs` **and nothing else**; identical BY REFERENCE when nobody is off-stage (`:131`) | ⛔ **Read it. Do not edit this file** — it is an input of two edge bundles. |
| **The reversible reader that keeps the view** | `src/domain/worldPulse/factionDensityKernel.js` | `function applyCadence` | appends the minted founder to `fresh.npcs` — a MUTATION read, already dispositioned `TE-DENSITY-1` | ⛔ **Untouched.** Its base is `fresh` (raw under EM-B1k), so its own disposition becomes TRUE rather than aspirational. |
| **The confirmation** | `src/domain/worldPulse/factionDensityKernel.js` | `function applyReactions` | `stillEmpty = factionRosterOf(fresh, faction).length === 0` (`:262`); the mark-clearing arm at `:287` reads the same `fresh` | ⛔ **Untouched.** A2 proves its verdict does not move. |
| **Permanent writer 1** | `src/domain/worldPulse/settlementLifecycleFirstClass.js` | `export function applySettlementLifecycleOutcomeToSettlement` | `:611-614` maps `settlement.npcs` stamping `dispersed: true`; **no save in the signature**; caller `applyWorldPulse.js:733` takes `entry.settlement` from `buildSettlementMap` | Comment only. A5 pins it at its real trigger. |
| **Permanent writer 2** | `src/domain/worldPulse/successorNpc.js` | `export function replaceOustedNpcs` | `:66` guards on `settlement?.npcs`, `:69-76` maps it replacing by **name**; **no save in the signature** | Comment only. A6 pins it at its real trigger. |
| **Writer 2's caller** | `src/domain/worldPulse/npcVerdictPulse.js` | `export function applyOrganicNpcVerdicts` | `:133` calls `replaceOustedNpcs(replacementSource, …)`; `replacementSource` is the `settlement` argument, which `pulseKernel.js:660` fills from `localSettlements` (`:617`) | ⛔ Untouched; named so the base is provable. |
| **The seam EM-B1k cures** | `src/domain/worldPulse/pulseKernel.js` | `function buildSettlementMap` | `:184` is EM-B1k's first replacement; the `localSettlements` seed at `:579` is its second | ⛔ **Not edited here.** This packet's whole premise is that both have landed. |
| **Writer 1's caller** | `src/domain/worldPulse/applyWorldPulse.js` | `function applyOutcomeToSettlement` | `:717` `beforeSettlement = entry.settlement`, `entry` from `settlementUpdates` = `buildSettlementMap`'s map (`:290`). The proposal path (`:1209`) builds its map from `save.settlement` — already raw | ⛔ Untouched. |
| **The chokepoint** | `src/domain/roads/state.js` | `export function isOffStage` | the ONE participation filter | ⛔ **Untouched** (ODQ §934.60: add NOTHING to it). |
| **The ratchet** | `tests/domain/roadsParticipation.test.js` | `function foundReaders` | `execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial'], …)` (`:308`) — **41 files** today | Widened to three roots. |
| **The quarantine** | `tests/domain/roadsParticipation.test.js` | `const UNDISPOSITIONED_NPCS_READERS` | 7 rows, ceiling `UNDISPOSITIONED_CEILING = 7`, monotone-down | ⛔ **Untouched** — the new conviction goes to `EXPECTED` **with** a disposition, never to the quarantine, and the ceiling is never raised. |
| **Test precedent** | `tests/domain/roadsParticipation.test.js` | `describe('participation chokepoint — the .npcs-reader inventory ratchet (§8 census)')` | a `tests/domain/**` suite that shells `grep` from `process.cwd()` and asserts an exact set | ⭐ A3 extends this arm in place. |
| **Test precedent** | `tests/generators/densityLaw.test.js` | `snapOf` (`:1412`, `:1571`) and its 13 `advanceFactionDensity` drives | `snapOf = (...list) => ({ settlements: list.map(s => ({ id: s.id, settlement: s })) })` — the items carry **NO `save` key** | ⭐ The new suite copies this shape **and adds `save`**, because a `save`-less item exercises the fallback and can never prove the cure. |

Forbidden alternatives: ⛔ no edit to `worldSnapshot.js`, `isOffStage`, `pulseKernel.js`, or any REVERSIBLE participation read; ⛔ no new helper, no new import, and no added effective line in any of the four production files; ⛔ no second roster projection, no `save` threaded into either permanent writer's signature; ⛔ no raise of `UNDISPOSITIONED_CEILING`, of any size baseline, or of any byte budget; ⛔ no files outside the manifest.

---

## 6. Exact contracts

### §6.1 · The one production change — ONE line replaced, NONE added

```js
// src/domain/worldPulse/factionDensityKernel.js :699, inside advanceFactionDensity.
// ONE line replaced, none added. `item.save?.settlement` is saveSettlement()'s exact
// meaning (worldSnapshot.js:11-13), inlined rather than imported.
    const tickStart = item && item.settlement ? asObject(item.save?.settlement || item.settlement) : null;
```

⛔ **No second line. No helper. No import. No reformat.** The guard stays `item && item.settlement` verbatim, so a snapshot item with no `settlement` still `continue`s exactly as today.

**Why the whole object and not just the roster:** `item.settlement` is `saveSettlement(save)` itself when nobody is off-stage, and otherwise `{ ..._s, npcs: filtered }` — a shallow copy that differs in `npcs` **and in nothing else** (`worldSnapshot.js:127-133`, read verbatim). So swapping the object is *exactly* swapping the roster, at one token instead of three.

**The `||` fallback is load-bearing and its limit is declared.** When a save carries no `.settlement` (the legacy shape `saveSettlement` exists for), `item.save?.settlement` is `undefined` and the expression falls back to `item.settlement` — today's behaviour, unchanged. In that legacy shape with somebody off-stage, the read stays filtered. ⛔ **This is EM-B1k's identical limit at `:184`, deliberately not diverged from**; it is recorded in §12.1 item 1, not cured here.

### §6.2 · The three comment-only contracts — ZERO effective lines, ZERO rendered bytes

Each states, in the file that could be broken, **which roster it is handed and by whom**. No code, no blank-line churn, and ⛔ **no `/*!`, `@license` or `@preserve` token** (those survive minification; every other comment is stripped, which is why the EAGER `successorNpc.js` row costs zero first-paint bytes).

| file | region | the sentence the comment must carry |
|---|---|---|
| `settlementLifecycleFirstClass.js` | the docblock above `:611`'s dispersal map | the dispersal writes a PERMANENT stamp over whatever roster its caller hands it; that base is `applyWorldPulse.js:733`'s `entry.settlement`, made RAW by **EM-B1k**; handed the participation view it silently drops every off-stage soul (measured) and breaks law 6 conservation. ⛔ Never re-base this on a projection. |
| `successorNpc.js` | the `replaceOustedNpcs` docblock | same shape: the base is `npcVerdictPulse.js:133`'s `replacementSource`, which is `pulseKernel.js:617`'s `localSettlements` entry, made RAW by **EM-B1k**; handed the participation view the returned roster is SHORT by every off-stage soul (measured). ⛔ Never re-base this on a projection. |
| `roadsKernel.js` | the three-line comment at `:1094-1096` above the full-roster emit (the symbol itself is `const fullRoster` at **`:425`** — ⚠ EM-B1k's §5 row carries a stale `:395` hint, evidence §10a) | re-pointed at **EM-B1k**: its sentence *"this full-roster update is the last word, so a hostage is never lost even under a naive save merge"* is no longer the estate's only defence against a filtered write base; the merge is now redundant-but-self-consistent and is deliberately kept. ⛔ Comment text only — this file is tolerance-zero on `scripts/.size-baseline.json` in **both** directions (§3.1). |

### §6.3 · The census — four dispositions and one root

**The root** (`tests/domain/roadsParticipation.test.js:308`, inside `function foundReaders`):

```js
    const out = execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial', 'src/domain/density'], { cwd: process.cwd(), encoding: 'utf-8' });
```

**The dispositions** — one new `EXPECTED` row and three rewrites. ⛔ The new row goes to `EXPECTED` **with** its disposition, never to the quarantine; `UNDISPOSITIONED_NPCS_READERS` and `UNDISPOSITIONED_CEILING = 7` are byte-identical.

| row | disposition the comment must carry |
|---|---|
| ⭐ **NEW** `src/domain/density/factionLifecycle.js` | `factionRosterOf` (`:113`) is the estate's roster filter and `readFactionLifecycle` (`:155`) is the R18 law that reads it. **Participation-INDEPENDENT by construction and REQUIRED to be**: it decides an IRREVERSIBLE consequence (a house swept out of `powerStructure.factions`), and §810.4 R18 admits only irreversible causes. Both its production callers in `factionDensityKernel.js` now hand it a RAW roster — the law at `tickStart` (EM-B1k2) and the confirmation at `fresh` (EM-B1k). ⛔ A caller that hands it the participation view dissolves a house because somebody is shelved. |
| **REWRITE** `factionDensityKernel.js` | keep the `TE-DENSITY-1` clause verbatim (it is about `applyCadence`), and ADD a second clause: the LIFECYCLE read (`tickStart` → `readFactionLifecycle`) and its confirmation (`stillEmpty` over `fresh`) both read the RAW roster — **irreversible ⇒ RAW** — while every REVERSIBLE reading in the file keeps the participation view. Name EM-B1k (the write base) and EM-B1k2 (this read). |
| **REWRITE** `settlementLifecycleFirstClass.js` | a PERMANENT roster writer whose base is its caller's (`applyWorldPulse.js:733`), not via-snapshot. ⛔ It is **not** covered by the blanket at `:73`, and saying so is the point of the row. |
| **REWRITE** `successorNpc.js` | the same, base `npcVerdictPulse.js:133` ← `pulseKernel.js:617`. ⛔ Not via-snapshot. |

### §6.4 · Determinism · dormancy · golden posture

**Determinism:** no draw, no key, no ordering change — `orderedIds` and the raw roster's own order are untouched. **Dormancy:** `readFactionLifecycle` returns `{governed:false, census:[], reactions:[]}` for every v1 world before it looks at a roster, so a shipped world is an exact no-op; a lit world with nobody off-stage has `item.save.settlement === item.settlement` BY REFERENCE, so the expression returns the identical object. **Absence:** a snapshot item with no `settlement` still `continue`s; a save with no `.settlement` falls through to `item.settlement` exactly as today. **Golden posture: UNCHANGED, and EXECUTED** — no fixture holds `stasis` or `whereabouts` and generation writes neither key (RECON-STAGE, re-measured here at 0 / 63 rostered NPCs), so the cure can only touch worlds where the class fires. **Behaviour shift: NONE, measured** — across the stride, the chain's `{changed, newsEntries, settlementUpdates}` is **identical** with a filtered and a raw `tickStart` (evidence §3). ⛔ Any movement is a STOP.

### §6.5 · Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| nothing | ⭐ the change: irreversible reads take the raw roster | unchanged (EM-B1k's) | unchanged | unchanged | `pulseUndoStack` unchanged | unchanged | unchanged (the veil reads the save) |

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/worldPulse/factionDensityKernel.js` | `advanceFactionDensity` — the `tickStart` line (`:699`) | ⛔ **+0 eff** | §6.1's single replacement, verbatim, plus a WHY comment. ⛔ **NET ZERO effective lines — measure with eslint's `Linter` before and after and quote both (expect 395 → 395).** No helper, no import, no reformat. |
| `MODIFY` | `src/domain/worldPulse/settlementLifecycleFirstClass.js` | the dispersal docblock above `:611` | ⛔ **+0 eff — COMMENT ONLY** | §6.2's sentence. No code byte changes; re-measure 462 → 462. |
| `MODIFY` | `src/domain/worldPulse/successorNpc.js` | the `replaceOustedNpcs` docblock | ⛔ **+0 eff — COMMENT ONLY** | §6.2's sentence. ⛔ No `/*!`, `@license` or `@preserve`: this module is EAGER and must render byte-identical. Re-measure 50 → 50. |
| `MODIFY` | `src/domain/worldPulse/roadsKernel.js` | `const fullRoster`'s comment | ⛔ **+0 eff — COMMENT ONLY** | §6.2's re-point. ⛔ Tolerance-zero both directions: re-measure 838 → 838 and keep `tests/lint/sizeBaseline.test.js` green. |
| `CREATE` | `tests/domain/irreversibleRawRoster.test.js` | A1 · A2 · A4 · A5 · A6 | **≤250 eff** | The red-first suite. ⛔ Opener imported from `'vitest'`; ONE literal `describe`; straight-line literal `it`s only; no `.each`, no loop or conditional registration, no nested describe; ⛔ never name a variable or parameter `it`, `test` or `describe`. Snapshot items MUST carry `save` (a `save`-less item exercises the fallback, not the cure). Model: `tests/domain/roadsParticipation.test.js`'s master-gate describe and `tests/generators/densityLaw.test.js`'s `snapOf`. |
| `TEST` | `tests/domain/roadsParticipation.test.js` | `foundReaders` (`:308`) + `EXPECTED` | `n/a` | §6.3: add `'src/domain/density'` as a third grep root; add the `factionLifecycle.js` row with its disposition; rewrite three dispositions. A3 is the EXISTING exactness arm — **no new `it`**. ⛔ Do not touch `UNDISPOSITIONED_NPCS_READERS`, `UNDISPOSITIONED_CEILING`, or the two `it` EM-B1k adds to the master-gate describe. |

**Generated artifacts: NONE.** ⛔ No `_shared` rows and **no generator among `checks`** — none of the four `src/` paths is an input of any of the five edge-shared bundles (measured), so §P2.12's seven-path hazard and the step-14a ordering hazard do not arise. No other file may be edited.

### §7.1 · The registration ledger — the measured NEGATIVES live here, never in the table above

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED** | ⛔ NO ABSOLUTE QUOTED. DELTA: **`+1 files / +0 parked / +1 credited / +5 titles / +1 suiteTitles`** — one new CREDITED test file (opener from `'vitest'`, ONE literal `describe`, five straight-line literal `it`: A1, A2, A4, A5, A6) and **zero** new titles in `roadsParticipation.test.js` (A3 extends an existing arm). An INTERIOR RED, named before it exists; the chair re-derives the whole tuple at the train's terminal. |
| P2.2 | mutation-coverage | **NOT OWED — measured** | `ENFORCER_DIRS` = `tests/{lint,design,docs,data,copy,security,edgeFunctions,generators}` — **no `tests/domain`** — and `irreversibleRawRoster` matches no `NAME_PATTERN` token (`census\|scan\|baseline\|ratchet\|walker\|killlist\|parity\|coverage\|governance\|freshness\|integrity\|exhaustiveness\|roundtrip\|golden\|contract\|pin`). |
| P2.3 | observed-shape | **NOT OWED; motion is a STOP** | No save-time key (`dmLayer`, `decrees`) is read. The edit adds `item.save?.settlement` — `save` and `settlement` are keys the snapshot item and the save provably carry, so no reader-without-a-writer identity is expected. ⚠ **PLAUSIBLE, not executed** (a lane runs no estate script): `node scripts/check-observed-shape-readers.mjs` is in `checks` and **any motion is a STOP**. |
| P2.4 | writer-reach | ⚠ **measure, do not assume** | None of the four carries a row in `scripts/.writer-reach-baseline.json` today (`grep -c` = 0, all four). A shrink is the plain `--write`; ⛔ **growth is a mint and a chair act.** In `checks`. |
| P2.5 · P2.7 | seeded chooser · prose-numerics | **NOT OWED** | No `rollFrom`, no draw, no rendered figure; the prose-numerics baseline names none of the four (`grep -c` = 0). |
| P2.6 · P2.8 · P2.9 | persisted keys · surfaces · preset witness | **NOT OWED** | No persisted key, no component, no tick hook. |
| P2.10 | edge-shared | ⭐ **NOT OWED — measured** | 0 hits for all four across the five metas' own `inputs` (114 / 74 / 115 / 2 / 2). |
| P2.11 | byte budgets | **PRICED — §3.2** | 0 B into the generation worker (proven by closure); 0 B REQUIRED into first paint (comment-only, EAGER module); ≤200 B into the lazy engine; a DELTA into the advance worker. |
| steps 13 · 15 · 16 | line-addressed · stamped · `path:line` citations | **NOT A RED — measured** | prose-numerics names none; `wiring-census` `stamp.files` (7 rows) names none; `tuningRegister` keys on `spanDigest` and pins comment-insertion explicitly; **zero** `path:line` citations of any of the five files across `src`, `docs/content`, `tests`. |
| step 10 | post-edit `requiredSymbols` simulation | ⭐ **ALL SIXTEEN SURVIVE; `retiredSymbols`: NONE** | The replaced line is not a `requiredSymbols` row of ANY packet (the 190-entry manifest holds rows on these paths only for `EP-3A`, `EP-3B`, `EM-B1d`, all `LANDED`, and none names it); the symbol `tickStart` itself survives verbatim. Nothing is moved, renamed or deleted. |
| step 12 | `tests/` fixture sweep | ⭐ **NO FIXTURE REDS — measured** | `tests/generators/densityLaw.test.js` drives `advanceFactionDensity` **13 times** through `snapOf`, whose items carry **no `save` key** ⇒ `item.save?.settlement` is `undefined` ⇒ every drive falls back to `item.settlement` ⇒ **byte-identical**. `roadsParticipation.test.js` names the file only as a census string. No test in the estate spells the replaced line. |
| ⛔ | the size ratchet | ⛔ **BINDING — §3.1** | `roadsKernel.js` 838 / 838, tolerance-zero both directions. A non-zero delta anywhere is a STOP. |

---

## 8. Ordered coding sequence

0. Dispatch and seal. ⛔ Refuse if EM-B1k is not LANDED.
1. **Capture the baselines:** eslint `Linter` effective lines on all four production files (expect **395 / 462 / 50 / 838**); `node scripts/check-writer-reach.mjs`; `node scripts/check-observed-shape-readers.mjs`; the pre-edit `foundReaders()` count (**41**).
2. **Write the reds first and watch them fail with today's exact messages** (§9 quotes them): A1's produced reaction, A4's fallback dissolution, A5's short roster, A6's short roster.
3. **Make the single replacement** (§6.1) and nothing else in that file.
4. **Re-measure the effective lines — 395 again.** A different number is a STOP.
5. **Add the three comment-only contracts** (§6.2); re-measure 462 / 50 / 838. A different number is a STOP.
6. **Widen the root and write the four dispositions** (§6.3); the widened `foundReaders()` must return **42**.
7. Run the focused suites, then the golden and dormancy set (§10).
8. Real `npm run build` through the exclusive mutex; attribution; the two `tests/build/` arms; §3.2's STOP conditions.
9. Write the completion receipt.

```text
1. the snapshot is built as today — the FILTERED view still goes to every participation read
2. the LAW is read from the raw roster        (this packet)
3. the WRITE BASE is already the raw roster   (EM-B1k)
4. so an irreversible decision is computed from truth, and the second guard has nothing left to refuse
```

---

## 9. Acceptance matrix

| ID | Case | Required observation | today's RED |
|---|---|---|---|
| **A1** | ⭐ **THE HABITAT IS GONE.** A generated town; the sole member of a NON-governing house shelved through `applyNpcOp('stasis-npc')`; `readFactionLifecycle` driven over the tick-start base. | **no reaction of any kind is minted for that house** — the dissolution is never PROPOSED, not merely refused. The already-empty houses in the same town still mint theirs (non-vacuity). | `reaction: ["faction_dissolved"]`, roster of the house `= 0` |
| **A2** | ⛔ **NOTHING MOVES — the chain is byte-identical.** The same town driven through `advanceFactionDensity` with a filtered and a raw tick-start base, the update entry raw in both (EM-B1k landed). | `{changed, newsEntries, settlementUpdates}` **deep-equal**; and a v1 (no `_densityLawVersion`) world returns the same `worldState` and `settlementUpdates` **references**, zero beats. | n/a (regression) |
| **A3** | **THE RATCHET'S NEW CONVICTION.** The widened three-root scan. | the reader set is **exactly** `EXPECTED ∪ UNDISPOSITIONED_NPCS_READERS`, **42** files, the one new member being `src/domain/density/factionLifecycle.js`; the quarantine list and `UNDISPOSITIONED_CEILING` are unchanged and the honesty arm is green. ⛔ Extends the EXISTING arm — no new `it`. | n/a (the root is 2 today, 41 files) |
| **A4** | ⛔ **THE FALLBACK ARM.** The same town, but the update entry carries **no `.settlement`**, so `fresh` falls back to `tickStart`. | the house is **not** dissolved and no `faction_dissolved` beat names it. | the house IS dissolved — measured **7 / 7** towns across the stride, with EM-B1k's raw write base in place |
| **A5** | **THE DISPERSAL CARRIES THE OFF-STAGE SOUL.** `applySettlementLifecycleOutcomeToSettlement` driven at its **real trigger** — a `terminal_death` `lifecyclePatch` on a thorp at the bottom rung (`settlementLifecycleEnabled` is lit in all four presets) — over the RAW base EM-B1k supplies. | every soul is in the output roster and every one carries `dispersed: true`, the shelved person included. Driving the same outcome over the participation view is the counterforce and **must** show the soul missing. | over the filtered base: `roster out 2 | dispersed stamps 2 | the shelved soul present: false` (raw: `3 | 3 | true`) |
| **A6** | **THE SUCCESSOR PASS KEEPS THE OFF-STAGE SOUL.** `replaceOustedNpcs` driven at its **real trigger** — an `ousted` exposure, the kind `advanceNpcCorruption` mints unconditionally at `pulseKernel.js:388` — over the RAW base. | the ousted person is replaced by a successor **and** the shelved person is still in the roster. The filtered base is the counterforce and must show them missing. | over the filtered base: `roster out 2 | the ousted replaced: true | the shelved soul present: false` (raw: `3 | true | true`) |
| **A7** | ⛔ **THE GOLDENS AND THE PARTICIPATION GUARANTEES.** | `generatorGoldenMaster`, `dossierProseManifest`, `roadsDormancyGolden` and the preset-lighting witness bytewise unchanged; `roadsParticipation`'s master-gate and ladder-belt arms green untouched — a shelved person is still never cast, never travels, never ladder-eligible. Justified by measurement: no fixture holds `stasis`/`whereabouts` and generation writes neither. | n/a |
| **A8** | ⛔ **THE CEILINGS HELD.** | `395 / 462 / 50 / 838` effective lines after the edits; `tests/lint/sizeBaseline.test.js` green; a real build shows **zero** attributed movement for `successorNpc.js` (EAGER) and `≤200 B` for `factionDensityKernel.js`; `tests/build/vendorPdfLazy.test.js` and `tests/build/generationWorkerLazy.test.js` green against fresh `dist`. | n/a |

Eight of ≤8 — the cap. Test homes: A1, A2, A4, A5, A6 → `tests/domain/irreversibleRawRoster.test.js` (five straight-line `it`); A3 → the existing exactness arm in `tests/domain/roadsParticipation.test.js`; A7 and A8 → §10's executed commands, no new title.

---

## 10. Verification commands

```sh
npx eslint src/domain/worldPulse/factionDensityKernel.js src/domain/worldPulse/settlementLifecycleFirstClass.js \
  src/domain/worldPulse/successorNpc.js src/domain/worldPulse/roadsKernel.js \
  tests/domain/irreversibleRawRoster.test.js tests/domain/roadsParticipation.test.js
npm run typecheck:ratchet && npm run typecheck:domain:strict

npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/irreversibleRawRoster.test.js tests/domain/roadsParticipation.test.js \
  tests/domain/settlementLifecycleFirstClass.test.js tests/domain/successorNpc.test.js \
  tests/domain/demographicsFloor.test.js tests/domain/settlementLifecycleVerbs.test.js \
  tests/domain/warH2VerdictComposition.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/generators/densityLaw.test.js
# ⛔ NOTHING MOVES — every golden this packet could touch, named
npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js \
  tests/property/roadsDormancyGolden.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/lint/sizeBaseline.test.js

node scripts/check-observed-shape-readers.mjs     # motion is a STOP
node scripts/check-writer-reach.mjs               # shrink = --write; growth = a chair act
node scripts/implementation-packets.mjs validate

# THE BYTE STEP — after a REAL build through the exclusive mutex (both arms are dist-gated)
npx vitest run --pool=threads --maxWorkers=2 tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js
```

⛔ **No generator among them** — this packet owes no edge-shared rebuild, so step-14a's ordering hazard does not arise. Every command exits `0`; the lighting walker's exact-count arm is the packet's ONE named interior red (§7.1 row P2.1) and the chair re-derives it at the terminal.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`'s list:

1. ⛔ **EM-B1k is not LANDED**, or `buildSettlementMap`'s write base is not raw.
2. ⛔ Any of the four production files does not re-measure **395 / 462 / 50 / 838** effective lines.
3. ⛔ **A2 reds** — the chain's output moved. The read change was supposed to be behaviour-neutral; it was not.
4. ⛔ Any golden, the roads dormancy golden or the preset witness moves.
5. ⛔ `check-writer-reach` or `check-observed-shape-readers` **grows**.
6. ⛔ The widened scan convicts anything other than exactly `src/domain/density/factionLifecycle.js`, or the quarantine list or its ceiling would move.
7. ⛔ The edit needs a second line, a helper, an import, or a fifth file.
8. ⛔ A real build attributes **any** movement to `successorNpc.js`, or the first-paint closure rises at all.
9. ⛔ A1, A4, A5 or A6 does not reproduce its stated red before the fix.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the next wave.

---

## 12. Completion receipt

Record with executed output: the four reds before and their greens after; effective lines before and after for all four files; `foundReaders()` 41 → 42; every golden's result; writer-reach and observed-shape before/after; the build's per-module attribution with `successorNpc.js` at zero; the lighting **DELTA** caused (`+1 files / +1 credited / +5 titles / +1 suiteTitles`) **as a delta, never an absolute**.

### §12.1 · NOTICED, NOT TOUCHED — each specific enough to slot

1. ⚠ **The legacy save shape is still filtered on both packets.** When `save.settlement` is absent (`saveSettlement`'s legacy fallback), EM-B1k's `:184` and this packet's `:699` both fall back to the participation view. Neither cures it. Whether any shipped save carries that shape is unmeasured. **Slot: a chair question, or a one-line measurement lane over the save corpus.**
2. ⚠ **`replaceOustedNpcs` joins by NAME, not identity** (`successorNpc.js:65`, `:70`). Under a raw base it can now see off-stage people, so a duplicate display name would replace the wrong soul — or two. Measured at stride 75: **0 duplicate names across 7 towns / 63 rostered NPCs** — a small sample, and the join is still a name. **Slot: a named cure packet (thread `exposure.npcId` from `npcVerdictPulse.js:133` and join on `npcId`), or CLOSED-with-reason after a full-corpus name census.**
3. ⚠ **`src/generators/density/titularSuccession.js` calls `factionRosterOf` and has no importer in `src/`** (RECON-STAGE §2.1, unre-measured here). It is dark, and whatever settlement its future caller passes is what it will read. **Slot: the packet that wires it owes the raw-base disposition; or a lane burns the dead module.**
4. ⚠ **`tests/store` is not an `ENFORCER_DIR` and `NAME_PATTERN` does not match `participationWriteBase`** (EM-B1k §12.1 item 5, re-measured true here). EM-B1k's regression suite and this one both owe no mutation-coverage row. **Slot: the chair's standing question about `ENFORCER_DIRS`.**
5. ⚠ **`factionDensityKernel.js`'s `TE-DENSITY-1` disposition is currently ASPIRATIONAL and becomes true only with EM-B1k.** It claims `applyCadence` reads *"the RAW roster of `fresh` — the freshest SAVED copy the write lands on"*; at this tip `fresh` descends from the participation view. EM-B1k makes the sentence true. Recorded so nobody reads the row as evidence of a protection that pre-dates the cure. **Slot: this packet's own §6.3 rewrite states it.**
6. ⚠ **The first-paint closure's live margin is unknown.** The newest figure in `vendorPdfLazy.test.js`'s own header is 1,047,205 against 1,048,000 (2026-09-01, T13), i.e. ~795 B, and EM-P0's raise note says only that the arm was *green* at `023eda2ec` without printing a figure. **Slot: the next real build records the number in the test's header, or a chair-run measurement lane.**
7. ⚠ **`tests/build/vendorPdfLazy.test.js`'s byte arms are `skipIf(!requireDistRead)`** — they measure nothing without a fresh `dist`, so a focused run that skips them is not evidence about bytes. Named so no receipt reads a skip as a pass. **Slot: this packet's §10 build step; worth a standing note in the preamble.**

---

## 13. RAISED — for the chair (numbered; the lane does not wait)

- **Q1 — THE BUDGET QUESTION, re-shaped by measurement.** The launch asked whether a fourth production file (`roadsKernel.js`, comment-only) may ride. The measurement changed the question: **neither permanent roster writer can read raw explicitly** (neither has a save in its signature) and **both are already handed the raw roster by EM-B1k** (evidence §5), so their only available cure is a comment-only base contract. The packet therefore reads **1 logic-bearing production file + 3 comment-only rows**. ⭐ **My recommendation: count comment-only rows as NOT logic-bearing**, on the LANDED precedent of `EM-B1d`, whose manifest carries a `MODIFY` row on `src/domain/density/factionLifecycle.js` marked *"⛔ COMMENT ONLY — THE FROZEN ARRAY IS BYTE-IDENTICAL"*, and on `EP-3A`'s note that `roadsKernel.js` is tolerance-zero in both directions so a comment is the only lawful edit into it at all. If the chair refuses that reading, the drop order is `roadsKernel.js` first (its comment is informational), then `successorNpc.js` (the only EAGER file) — both re-slotted where those files are next edited.
- **Q2 — is a comment-only contract the cure the chair meant by "cured with the class"?** The alternative is to leave both files untouched and carry the cure entirely in the census dispositions and A5/A6. ⭐ **My recommendation: keep the comments.** The census tells a lane that adds a NEW `.npcs` reader; it says nothing to a lane editing an EXISTING writer's caller, and the comment sits where that lane will actually be reading. Cost is provably zero lines and zero rendered bytes.
- **Q3 — the RECON's "unreachable" premise is refuted (§1.1).** Both lanes are live: `settlementLifecycleEnabled` is lit in all four presets, and `advanceNpcCorruption` runs unconditionally. Confirm that A5 and A6 should be driven at those real triggers (as contracted) rather than at the function boundary the launch allowed as a fallback.
- **Q4 — the name join (§12.1 item 2).** Under a raw base `replaceOustedNpcs` can now reach off-stage people by display name. Zero duplicates at stride 75. Does the chair want a full-corpus name census, a cure packet, or CLOSED-with-reason?
- **Q5 — the legacy save shape (§12.1 item 1).** Both packets fall back to the participation view when `save.settlement` is absent. Measure the save corpus, or accept and record?
- **Q6 — `EXPECTED` vs the quarantine for the new conviction.** The packet puts `src/domain/density/factionLifecycle.js` in `EXPECTED` **with** a written disposition, because the disposition is exactly what this packet establishes. Confirm; the quarantine route would be the alternative and would leave `UNDISPOSITIONED_CEILING` at 7 with an eighth member.
- **Q7 — `checks` and the dist-gated byte arms (§12.1 item 7).** The two `tests/build/` arms skip without a fresh `dist`. They are listed in §10 after the build step and in the manifest's `checks`. Confirm the chair wants them in the sealed `checks` (where they will skip unless the build lane has built) rather than in the build lane's narrative only.
