# `settlement editor / record merge` — EM-R0f: the economy fingerprint moves down a layer, and the move is proven invisible

- **Status:** `DRAFT`
- **Packet version:** `1`
- **Verified base:** `__BASE__`
- **Last revalidated:** `__BASE__` — stamped by the chair at placement.
- **Depends on:** nothing. EM-R0f is a leaf move with no predecessor. ⭐ **EM-R0c depends on IT** (charter, amendments of 2026-09-20 02:30: the family's order is R0a · R0d · R0b v3 · **R0f** · R0c · R1–R5 · R6 · R7), because R0c's merge recomputes the fingerprint from `src/domain/edit/` and must not import `src/generators/` to do it.
- **Collision group:** ⭐ **EMPTY.** Across all 193 manifest entries the only packet naming any path of this one is `EM-P3` on `tests/build/generationWorkerLazy.test.js`, and `EM-P3` is **LANDED** — `TERMINAL_PACKET_STATUSES = {LANDED, SUPERSEDED}` (`scripts/implementation-packets.mjs:43`) do **not** reserve change paths (`:676`). Only 3 of 193 entries are non-terminal and none names a path here.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured at `141a1d775` — the function's body and its three-declaration closure; the consumer census with its denominator; the `src/data` purity rule and its paired test; the boundary ratchet's frozen set re-derived by the walker's own logic; the four chunk closures through vite's own export; the edge-shared input membership; the esbuild per-module byte delta; the tuning, observed-shape, writer-reach, prose-numerics, wiring-census, mutation and entropy-root registers; the 525-row golden-neutrality digest.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: `16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195` — stamped by the chair at placement; **re-measured identical at `141a1d775`** by this compile).

> **REVALIDATION SENTENCE for the chair:** *"Revalidated at `<tip>`: `fingerprintPowerEconomyInput` is still declared at `src/generators/power/economyReconciliation.js:100` and the whole-repo census is still exactly five rows (three in that file, two in `tests/generators/powerEconomyFreshness.test.js`); `economyProjectionInput` and `ECONOMY_FINGERPRINT_VERSION` are still read only inside it, and `fnv1a32` only at `:109`; `BASELINE_EDGES` still holds 4 files / 5 specifiers and names `economyReconciliation.js` in none of them, with the live count still 5; the `src/data/**` purity rule still bans only generators/store/lib/kernel-prng/kernel-rngContext and `tests/domain/dataPurity.test.js` still has exactly its three arms; the worker closure still holds the file and the eager closure (268) still does not; the five edge-shared metas still return zero input hits; the 525-row fingerprint digest is still `318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18`; `src/data/economyFingerprint.js` is absent and untracked; the preamble hashes `16dfb96f…`; EP-0's `requiredSymbols` row on this path is the NC-1 text, which this packet does not touch; and no non-terminal packet reserves a change path here."*

---

## 0. Scope, and why this packet exists at all

EM-R0c (the record merge, accepted at 294 effective lines) must recompute the power/economy fingerprint when a DM edit moves one of the four economic fields it reads. There are exactly three ways it could get that fact, and two are refused by measurement:

1. ⛔ **Import the generator from `src/domain/edit/`.** `tests/build/domainGeneratorsBoundary.test.js` freezes the `src/domain → src/generators` edge set **shrink-only**. Its `BASELINE_EDGES` holds **4 files / 5 specifiers** today. R0c would be the **fifth file** — a new importer, which the walker's first arm reds by name.
2. ⛔ **Take `R1`'s digest instead.** Refuted by execution at the R0c compile: wrong for the merged record in **31 of 315** trials (ODQ §934.47 addendum 35).
3. ⭐ **Move the leaf DOWN into a layer both can import.** One fact, one spelling, no new edge. This packet.

Re-implementing the fingerprint in the domain would spell one fact twice, and two spellings of a freshness digest drift silently — which is the precise failure `assertPowerEconomyFreshness` exists to catch.

## 1. Reconciled authority

1. **ODQ §934.47 addendum 35, ruling (1)** (2026-09-20 02:30, the chair, vetoable) — EM-R0f chartered as its own golden-neutral member: the pure move, the byte-identical proof over all 525 rows, the boundary ratchet's frozen set never growing, `domainGeneratorsBoundary.test.js`'s stale header prose corrected here, the worker's bytes measured.
2. **`docs/implementation/charters/EDIT-MODE-TRAIN.md`, amendments of 2026-09-20 02:30** — the family's build order places **R0f before R0c**.
3. **`docs/implementation/preambles/EM-PREAMBLE.md` §P2** rows 1, 2, 3, 4, 7, 10, 11, 12 — the registration cost, priced in §7.1.
4. **`docs/implementation/PACKET_STANDARD.md`** — the hard scope budget, the exact contracts, the verified tree contract, the STOP conditions.
5. **The tree at `141a1d775`**, measured — every row of §5.

### §1.1 · One premise qualified by measurement — reported, not adjudicated

⛔ **THE FROZEN SET DOES NOT SHRINK. IT IS UNCHANGED.** The charter's parenthesis reads *"the domain→generators boundary ratchet's frozen set SHRINKS, never grows"*. Measured at `141a1d775`: `BASELINE_EDGES` names `checkDraftEdit.js`, `neighbourBackLink.js`, `institutionLifecycle.js` and `resourceDynamicsKernel.js` — **not one row names `economyReconciliation.js`**, and **no `src/domain/**` file imports `fingerprintPowerEconomyInput`** (the whole-repo census is five rows, all inside the generator and its own test). ⇒ **the rows this move retires number ZERO.**

This does **not** refute the ruling: the charter's own `because` clause is forward-looking — *"a `src/domain/edit/` import of `src/generators/` would be the ratchet's fifth file"*. EM-R0f is therefore a **PREVENTIVE** member, not a burndown member: it removes the reason the set would have grown, and the set's correct post-move cardinality is the same 4 / 5 it is today. The packet declares the retired rows as **none** and changes `BASELINE_EDGES` **not at all**. §13 Q1 asks the chair to re-cut the charter's clause to say so.

## 2. Outcome

`fingerprintPowerEconomyInput`, its private input-projector and its version constant leave `src/generators/power/economyReconciliation.js` and become `src/data/economyFingerprint.js` — a pure leaf whose only import is the kernel's deterministic hash. Both of today's callers (the stamp at `:171`, the freshness assertion at `:358`) keep their exact call text and reach the function through one new import; the one external importer, `tests/generators/powerEconomyFreshness.test.js`, is re-pointed in the same commit, so **no re-export stub is left behind**. `tests/build/domainGeneratorsBoundary.test.js`'s header is corrected to what the tree measures and gains EM-R0f's citation.

**Nothing observable changes.** The fingerprint over all 525 golden rows is byte-identical, executed: `318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18`, the same digest computed three ways — from the function at its current home, from the moved leaf, and from what the pipeline actually writes onto `powerStructure.economyInputFingerprint`.

## 3. Hard scope budget

| Measure | Cap | This packet | Receipt |
|---|---:|---:|---|
| Handwritten files | 12 | **4** | §7 |
| New/changed effective production lines | 400 | **44** | eslint `Linter`, `max-lines` + `skipBlankLines` + `skipComments` |
| Each new leaf | 250 | **22** | `src/data/economyFingerprint.js` |
| New logic leaves | 2 | **1** | the fingerprint leaf |
| Existing logic files modified | 3 | **1** | `economyReconciliation.js` (280 → **259** eff, −21) |
| Acceptance cases | 8 | **5** | §9 |
| Launch-brief small-member threshold | 120 eff / 5 files | **44 eff / 4 files** | under both |

⛔ **No hot file is named.** ⛔ **Golden posture: UNCHANGED** — `generator-golden-master.json`, `dossier-prose-manifest-golden.json` and the preset witness are byte-identical; `UPDATE_GOLDEN` and `GOLDEN_SHIFT_SIGNED` are FORBIDDEN, and a moving golden is a STOP.

### §3.1 · The byte budgets, priced (§P2 row 11)

| Budget | Membership | Instrument | Verdict |
|---|---|---|---|
| **Generation worker** | ⭐ **IN** — `economyReconciliation.js` is in the worker's closure (220 src modules static; 228 with dynamic edges), so the new leaf joins it | `WORKER_BUNDLE_CEILING_BYTES = 1401208`, **EXACT, zero slack, monotone-down** | **CARRIED — §7's TEST row.** Bound **≤184 B** (the measured +92 B esbuild per-module estimate ×2). A rise needs the chair's re-mint. |
| **Lazy engine** | ⭐ **IN** — reachable from `main.jsx` through a dynamic boundary (1,958 modules) but **absent** from the 243-module static closure and from the 268-module eager set | `vendorPdfLazy.test.js:787`, `expect(size).toBeLessThan(679_000)` | **FITS, declared.** Last recorded 677,935 B (EM-P3's shrink) + 184 = 678,119; + the kept ~700 B cross-environment margin = **678,819 < 679,000**, ~181 B to spare. ⚠ near-full: an overshoot at the real build is a **STOP**, never a lane's raise. |
| **Eager first paint** | ⛔ **OUT — measured** | `EAGER_FIRST_PAINT_MODULES` imported from `vite.config.js`'s own export (268 modules) | `economyReconciliation.js` is **not** eager, so the leaf it reaches is not either. **0 B of first-paint cost.** |
| **Edge-shared metas** | ⛔ **OUT — measured by INPUT membership** | the five metas' own `inputs` (114 / 74 / 115 / 2 / 2) | **0 hits** for the modified path, the created path and `kernel/proseHash.js`. **No `build:edge-shared`**, so §P2 row 12's seven-path hazard and the generator-last ordering hazard do not arise. |

⭐ **THE CURE IS THE PLACEMENT BEFORE IT IS THE CEILING**, and here the placement is already minimal: the worker genuinely executes this function (`:171` and `:358` are both on the generation path), so its bytes are irreducible. The +92 B is module-boundary overhead alone — the same expression tree, one extra wrapper, one export binding — and rollup's scope hoisting normally renders less than esbuild's per-module estimate. There is no cheaper placement; there is only the honest re-mint.

## 4. Sealed dispatch and preflight

Ordinary sealed dispatch on the integration branch. Preflight must find `src/data/economyFingerprint.js` **absent and untracked** (measured absent at `141a1d775`), the substrate unchanged since the verified base, and the worktree git-clean. The four `checks` directories are `tests/generators`, `tests/domain`, `tests/build` and `tests/property` — **one directory per vitest invocation**. ⛔ **No generator is among `checks`**, so step 14(a)'s ordering hazard does not arise.

## 5. Verified tree contract

Every row re-found BY SYMBOL at `141a1d775`; line numbers are the tip's and the chair refreshes them at promotion.

| # | Path | Symbol | The fact | Proved by |
|---|---|---|---|---|
| 1 | `src/generators/power/economyReconciliation.js` | `fingerprintPowerEconomyInput` | declared and exported at `:100`; called at `:171` and `:358` | `git grep -n 'fingerprintPowerEconomyInput' HEAD -- src tests scripts` → 5 rows |
| 2 | same | `economyProjectionInput` | private helper at `:85`; read **only** at `:101` | `grep -n` → 2 rows, repo-wide 2 |
| 3 | same | `ECONOMY_FINGERPRINT_VERSION` | private `const` at `:37`; read **only** at `:103` and `:110` | `grep -n` → 3 rows, repo-wide 3 |
| 4 | same | `fnv1a32` | imported at `:24`, used **only** at `:109` ⇒ the import moves with the function | `grep -n 'fnv1a32'` → 2 rows |
| 5 | same | `rngSeed: stepRng.fork(POWER_STREAM).seed,` | EP-0's `requiredSymbols` text (NC-1, the entropy census's MANDATORY live control) at `:132`, **outside the moved region** | `grep -c` on the simulated remainder → 1 |
| 6 | same | `createPRNG(intent.rngSeed)` | the walker's second NC-1 `toContain` at `:160`, **outside the moved region** | `grep -c` on the simulated remainder → 1 |
| 7 | `src/kernel/proseHash.js` | `fnv1a32` | exists; already imported by `src/data/historyData.js` and `src/data/npcData.js` | `git grep -n "from '../kernel/" HEAD -- src/data` |
| 8 | `tests/build/domainGeneratorsBoundary.test.js` | `BASELINE_EDGES` | `:60-65`, **4 files / 5 specifiers**; names `economyReconciliation.js` in none | the walker's own `liveEdges()` re-run in plain node → 4 files / 5 edges |
| 9 | same | `it('baseline is exactly the 6 known edges (cardinality guard)')` | `:159`, asserting `toBeLessThanOrEqual(6)` at `:164` against a live count of **5** | same probe → `SLACK = 1` |
| 10 | `tests/generators/powerEconomyFreshness.test.js` | the import block at `:17-19` | imports `assertPowerEconomyFreshness` **and** `fingerprintPowerEconomyInput` from the generator | `awk 'NR>=10 && NR<=26'` |
| 11 | `eslint.config.js` | the `src/data/**` override | `:859-877`; bans only `**/generators/**`, `**/store/**`, `**/lib/**`, `**/kernel/prng*`, `**/kernel/rngContext*` | read whole |
| 12 | `tests/domain/dataPurity.test.js` | its three arms | `:57`, `:73`, `:101`; **no arm forbids an exported function in `src/data`** | read whole; 16 of 57 `src/data` files already export functions |

## 6. Exact contracts

### §6.1 · `src/data/economyFingerprint.js` — CREATE

The file holds **exactly three declarations, lifted VERBATIM** from `economyReconciliation.js` (`:37`, `:85-92`, `:94-111` — the JSDoc travels with its function), preceded by a header and one import. Byte-for-byte fidelity is a contract, not a courtesy: it is what makes §9's A1 a tautology rather than a hope.

- `import { fnv1a32 } from '../kernel/proseHash.js';` — the ONLY import. ⛔ Nothing from `src/generators`, `src/domain`, `src/store`, `src/lib`, `kernel/prng` or `kernel/rngContext`.
- `const ECONOMY_FINGERPRINT_VERSION = 'power-economy-v1';` — **not exported** (nothing in the estate reads it; §13 Q4).
- `function economyProjectionInput(economicState, tier)` — module-private, unchanged.
- `export function fingerprintPowerEconomyInput(economicState, tier)` — unchanged, including its JSDoc.

**Signature and return, unchanged and exact:** `(economicState: object|null|undefined, tier: string|null|undefined) → string` of the form `` `power-economy-v1:${8-hex-digit FNV-1a}` ``. Absence semantics are the four `||` defaults, preserved verbatim: missing `tier` → `''`; missing `prosperity` → `'Moderate'`; missing `safetyProfile.safetyLabel` → `'Moderate'`; missing `foodSecurity.label` → `'Secure'`. Tuple ORDER is the contract (version, tier, prosperity, safetyLabel, foodLabel) and the explicit array is what avoids key-order ambiguity. **Pure:** no draw, no clock, no mutation of either argument.

The header states WHY the leaf is here: two layers need one fact; a domain→generator import would be the ratchet's fifth file; a second spelling would drift; the kernel-hash edge is the one `historyData.js` and `npcData.js` already take and is outside every pattern the purity rule bans.

### §6.2 · `src/generators/power/economyReconciliation.js` — MODIFY

Four textual acts, no fifth:
1. **DELETE** `:24` `import { fnv1a32 } from '../../kernel/proseHash.js';` — it becomes unused and would red `no-unused-vars`.
2. **INSERT**, at the head of the import block (before `:22`'s `../../domain/clone.js`, the file's own alphabetical idiom — `data` < `domain` < `kernel`): `import { fingerprintPowerEconomyInput } from '../../data/economyFingerprint.js';`
3. **DELETE** `:37` and **DELETE** `:85-112` (the helper, the JSDoc, the function and one of the two surrounding blank lines), leaving exactly one blank line between `powerLabelFor`'s close and `createPowerGenerationIntent`'s JSDoc.
4. ⛔ **Nothing else.** The call sites at `:171` and `:358` keep their text byte-for-byte; no reformat, no comment churn, no reordering of any other import.

⛔ **NO RE-EXPORT.** `export { fingerprintPowerEconomyInput }` must NOT be added here. The one external importer is re-pointed in this same commit (§6.3), so a stub would preserve nothing and would leave the old home as a second address for one fact — the ambiguity the move exists to remove.

Measured outcome: 280 → **259** effective lines; `export function fingerprintPowerEconomyInput` absent; `fnv1a32` absent; EP-0's NC-1 text present.

### §6.3 · `tests/generators/powerEconomyFreshness.test.js` — TEST

Split the import block at `:17-19`. `assertPowerEconomyFreshness` keeps its import from `../../src/generators/power/economyReconciliation.js`; `fingerprintPowerEconomyInput` gets its own `import { fingerprintPowerEconomyInput } from '../../src/data/economyFingerprint.js';`. The call at `:156` is untouched — the binding name is identical.

⛔ **No `describe` and no `test`/`it` is added, removed or renamed here.** This re-point is also the packet's structural pin: if a later hand moved the function back, this import would fail to resolve.

### §6.4 · `tests/build/domainGeneratorsBoundary.test.js` — MODIFY (the charter's own row)

⛔ **`BASELINE_EDGES` IS NOT TOUCHED.** The frozen set stays at its measured 4 files / 5 specifiers (§1.1).

Correct the header to what the tree measures, and cite EM-R0f as the reason the set will not grow:
1. `:9` — "`src/domain/worldPulse`, ~22.7k LOC" → the measured figure (**183,678 lines across 443 files** at `141a1d775`), or drop the figure and keep the qualitative claim. A stale number in a ratchet's own header teaches a later reader the wrong scale.
2. `:44-51` — the six-row "Baseline captured at HEAD 8e10816" list contradicts the W6 note immediately below it (three of the six are gone) and `BASELINE_EDGES` itself. Replace it with the **four** live rows, or state plainly that the list is historical and `BASELINE_EDGES` is authoritative.
3. Add EM-R0f's citation: the fingerprint moved to `src/data/economyFingerprint.js` **so that EM-R0c's `src/domain/edit/` merge reads it without becoming this baseline's fifth file** — the inversion this header prescribes, executed once.
4. `:159` / `:164` — the `it` title says "exactly the 6 known edges" and the arm asserts `<= 6` against a live count of **5**: one unit of slack in a set whose header says it can only shrink. **The chair's call (§13 Q2).** Recommended: retitle to name 4 files / 5 edges and tighten the arm to `toBeLessThanOrEqual(5)`.

⛔ Whatever the chair rules, **no `describe`/`it` is added or removed** — only a title may be reworded, which moves no census count.

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | ⭐ `src/data/economyFingerprint.js` | `fingerprintPowerEconomyInput`, `economyProjectionInput`, `ECONOMY_FINGERPRINT_VERSION` | **≤250 eff** (measured **22**) | §6.1. The three declarations **VERBATIM** from `:37`, `:85-92`, `:94-111` — diff them against the pre-edit file and quote the zero. One import: `../kernel/proseHash.js`. ⛔ No other import. ⛔ No em dash and no exclamation point in any string literal (`tests/copy/voiceMechanics.test.js`). |
| `MODIFY` | `src/generators/power/economyReconciliation.js` | the import block; `:37`; `:85-112` | **−21 eff** (280 → 259) | §6.2's four acts, no fifth. ⛔ **No re-export.** ⛔ The call text at `:171`/`:358` and EP-0's NC-1 text at `:132`/`:160` must come through byte-identical — `grep -c 'rngSeed: stepRng.fork(POWER_STREAM).seed,'` and `grep -c 'createPRNG(intent.rngSeed)'` both **1** after the edit, quoted in the receipt. |
| `TEST` | `tests/generators/powerEconomyFreshness.test.js` | the import block `:17-19` | **+1 line** | §6.3. ⛔ No new or renamed `describe`/`test`/`it`. ⛔ Never name a variable or parameter `it`, `test` or `describe`. |
| `MODIFY` | `tests/build/domainGeneratorsBoundary.test.js` | the module header `:1-59`; `:159`/`:164` per the chair's Q2 ruling | **comment-only**, plus at most one title + one numeral if Q2 says tighten | §6.4. ⛔ **`BASELINE_EDGES` unchanged.** ⛔ No `describe`/`it` added or removed. |
| `TEST` | `tests/build/generationWorkerLazy.test.js` | `WORKER_BUNDLE_CEILING_BYTES` + its dated attribution comment | **≤184 B** | ⛔ **ONLY** if the build lane's real build measures a rise. Re-mint to the **exact** measured bundle in commit `91d5f155b`'s form, with the per-module attribution showing **only this packet's two modules moved**. A rise beyond 184 B, or any third module moving, is a **STOP**. The constant and its comment only. |

**Generated artifacts: NONE.** No `supabase/functions/_shared` row (§P2 row 10, measured zero input hits) and **no generator among `checks`**. No register file is written by this packet. No other file may be edited.

### §7.1 · The registration ledger — the measured NEGATIVES live here, never in the table above

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | sovereignty lighting | ⭐ **DELTA `0 files / 0 parked / 0 credited / 0 titles / 0 suiteTitles`** | ⛔ NO ABSOLUTE QUOTED. The packet CREATEs and RENAMEs **no** test file and adds/removes **no** `describe`/`it`; the baseline stores five integers and metadata only — **no title text** — so a reworded title (§6.4 item 4) moves nothing. The census is re-derived whole at the train's terminal, BY THE CHAIR. |
| P2.2 | mutation coverage | **NOT OWED** | Keyed by invariant TEST FILE. No `tests/lint/` file is created; no test file is created or renamed, so nothing enters `enumerateInvariants` and no entry goes stale. `powerEconomyFreshness.test.js` is already enumerated (`kind=rationale`); `domainGeneratorsBoundary.test.js` is **not enumerated** at all. |
| P2.3 | observed-shape readers | **NOT OWED** | The three tree manifests are content-addressed and **frozen at `31ab5d18b`**, not re-taken at a landing. ⭐ EXECUTED PRECEDENT: `EM-P3` (LANDED) modified a generator and created `src/data/worldFactOptions.js`, names this baseline nowhere, and that file is **absent** from all three trees. The file's one `inventory` row, `{"source on factions": 1}`, is `isNeighbourFaction`'s read and **stays**. The moved body reads no `dmLayer`/`decrees` key and its reads sit in the scanner's unresolved population. |
| P2.4 | writer-reach | **NOT OWED** | `grep -c 'economyReconciliation' scripts/.writer-reach-baseline.json` → **0**. The row `"economyInputFingerprint on powerStructure"` names a key and shape; the WRITE at `:171` does not move. Nothing is added under `src/domain/edit/**`. |
| P2.5 · P2.7 | seeded chooser · prose-numerics | **NOT OWED** | No `rollFrom`, no draw, no rendered figure; the prose-numerics baseline names neither path. |
| P2.6 · P2.8 · P2.9 | persisted keys · surfaces · preset witness | **NOT OWED** | No persisted key, no component, no tick hook. |
| P2.10 | edge-shared | ⭐ **NOT OWED — measured by INPUT membership** | 0 hits for the modified path, the created path and `kernel/proseHash.js` across all five metas' own `inputs` (114 / 74 / 115 / 2 / 2). |
| P2.11 | byte budgets | **PRICED — §3.1** | Worker **IN** (zero-slack, carried); lazy engine **IN** (fits, ~181 B to spare, near-full); eager first paint **OUT** (268-module closure re-derived through vite's own export); edge-shared **OUT**. +92 B esbuild per-module, bound ≤184 B. |
| P2.12 | paths a declared command writes | **NONE** | No generator among `checks`; no declared command writes any tracked path. |
| steps 13 · 15 · 16 | line-addressed · stamped · `path:line` citations | ⭐ **NOT A RED — measured** | prose-numerics names neither path; `wiring-census.json` `stamp.files` does not name `economyReconciliation.js` (`grep -c` → 0), so no `stale-bytes`; **`git grep -n 'economyReconciliation\.js:[0-9]' HEAD -- src docs tests scripts` → 0 hits**, so deleting 29 lines from the middle shifts no cited address. |
| — | tuning register | ⭐ **UNCHANGED — EXECUTED both ways** | The register's own `countUnregisteredNamed`/`countBareDecimals` over before/after sim roots: **`{economyReconciliation.js: 2}` sites `[POWER_INTENT_VERSION, POWER_PROJECTION_VERSION]` both times**; bareDecimals `{}` both; committed row **2**. The moved `ECONOMY_FINGERPRINT_VERSION` is a string (never in P2) and `16`/`8` are integers (P3 counts decimals only). `TREES_P2P3 = ["src/domain","src/generators"]` — `src/data` is out of scope, and the new leaf scores 0 even when forced in. |
| — | entropy-root census | ⭐ **SURVIVES — measured** | NC-1, the walker's MANDATORY live negative control, IS this file (`:185`, `:605`). It asserts by **TEXT** (`toContain`), not by line, on two strings outside the moved region; `WRITE_KEY_SITES`' exact-set equality is by **path**, unchanged. |
| step 10 | post-edit `requiredSymbols` simulation | ⭐ **ALL 14 SURVIVE; `retiredSymbols`: FOUR, all discharged** | The four texts that leave `economyReconciliation.js` — `export function fingerprintPowerEconomyInput(economicState, tier) {`, `function economyProjectionInput(economicState, tier) {`, `const ECONOMY_FINGERPRINT_VERSION = 'power-economy-v1';` and `import { fnv1a32 } from '../../kernel/proseHash.js';` — are `retiredSymbols` rows and appear in `requiredSymbols` **nowhere** (the successor joins only at the LANDED flip). Of all 193 manifest entries, the **only** `requiredSymbols` row on that path belongs to `EP-0` (LANDED), naming `"rngSeed: stepRng.fork(POWER_STREAM).seed,"` — which this packet does not touch (`grep -c` on the simulated remainder → 1), so it is discharged by construction. `WORKER_BUNDLE_CEILING_BYTES`' row is written as the **prefix** `export const WORKER_BUNDLE_CEILING_BYTES = `, which survives a re-mint of the numeral. All 19 strings verified present exactly once at `141a1d775`. |

## 8. Ordered coding sequence

1. **K-GATE, before the first edit.** `git status --short` empty; `shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json` recorded; `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` = `16dfb96f…`; `src/data/economyFingerprint.js` absent; the five census rows of §5 row 1 re-grepped and quoted.
2. **RED FIRST, and it is the packet's own acceptance case.** Before any edit, run the golden-neutrality probe at the base and quote `318fb81a…618e18`. Then create the leaf and re-run it importing the **new** file: the digest must be identical. A probe that comes back different is a **STOP**; a probe that cannot run is a STOP, not a pass.
3. **CREATE** `src/data/economyFingerprint.js` (§6.1). Diff its three declarations against the pre-edit source and quote the zero-byte delta.
4. **MODIFY** `src/generators/power/economyReconciliation.js` (§6.2). Re-measure effective lines (expect 280 → 259) and quote both. `grep -c` EP-0's two NC-1 strings → 1 each.
5. **TEST** `tests/generators/powerEconomyFreshness.test.js` (§6.3).
6. **MODIFY** `tests/build/domainGeneratorsBoundary.test.js` (§6.4), per the chair's Q2 ruling.
7. **GATED BATCH A** — §10 rows 1–5, PAUSE-AND-RESUME.
8. **THE BYTE PROOF** (its own gated batch): a real `npm run build` through the exclusive mutex, then the kit's per-module attribution against a control build at the verified base. Exactly **two** modules may move — `src/generators/power/economyReconciliation.js` (down) and `src/data/economyFingerprint.js` (new). A third module moving is a STOP. Then `VERIFY_DIST=1` on `tests/build/generationWorkerLazy.test.js` and `tests/build/vendorPdfLazy.test.js`, quoting the **executed** figures and the dist read. Re-mint the worker ceiling only if it rose, only to the exact measurement, only in `91d5f155b`'s form.
9. **GATED BATCH B** — the standing instruments: `tests/lint` WHOLE, `tests/lint/negativeAssertionAnchor.walker.test.js`, `tests/copy/voiceMechanics.test.js`, `tests/lint/mutationCoverageManifest.test.js`, `npx eslint` on all four touched files. `tests/lint/sovereigntyLightingContract.walker.test.js` run ONCE, separately — **expected GREEN** (delta 0/0/0/0/0); ⛔ never refreeze it.
10. Re-hash both goldens: identical to step 1.

## 9. Acceptance matrix

| id | case |
|---|---|
| **A1** | ⭐ **GOLDEN NEUTRALITY, the packet's own proof.** Over all **525** rows of `goldenCorpus()`, `fingerprintPowerEconomyInput` imported from `src/data/economyFingerprint.js` returns, row for row, exactly what the pre-move function at `src/generators/power/economyReconciliation.js` returned, and exactly what the pipeline writes to `powerStructure.economyInputFingerprint`. SHA-256 over `keyOf(c) \t fingerprint` in corpus order = `318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18`. Zero disagreements. |
| **A2** | Both goldens and the preset witness are byte-identical across the change; `tests/property/generatorGoldenMaster.test.js` and `tests/property/dossierProseManifest.test.js` are green with no door set. |
| **A3** | `tests/generators/powerEconomyFreshness.test.js` is green with `fingerprintPowerEconomyInput` imported from its new home and `assertPowerEconomyFreshness` still from the generator — the freshness invariant still throws on a perturbed prosperity and on a fingerprint-stripped power structure. |
| **A4** | `tests/build/domainGeneratorsBoundary.test.js` is green and `BASELINE_EDGES` is byte-identical: the live set is still **4 files / 5 specifiers**, and `src/data/economyFingerprint.js` creates **no** `src/domain → src/generators` edge (it is not under `src/domain`, and `generatorSpecifiers` matches only `/generators/`). |
| **A5** | `tests/domain/dataPurity.test.js` is green with the new leaf in the walked set: it imports nothing from `generators`/`store`/`lib`, captures no `rngContext`, and imports no `kernel/prng`. `npx eslint src/data/economyFingerprint.js` passes the `src/data/**` `no-restricted-imports` override. |

## 10. Verification commands

1. `npx vitest run --pool=threads --maxWorkers=2 tests/generators/powerEconomyFreshness.test.js`
2. `npx vitest run --pool=threads --maxWorkers=2 tests/domain/dataPurity.test.js`
3. `npx vitest run --pool=threads --maxWorkers=2 tests/build/domainGeneratorsBoundary.test.js`
4. `npx vitest run --pool=threads --maxWorkers=2 tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js`
5. `npx eslint src/data/economyFingerprint.js src/generators/power/economyReconciliation.js tests/generators/powerEconomyFreshness.test.js tests/build/domainGeneratorsBoundary.test.js`
6. `npm run typecheck:domain:strict`
7. `npm run typecheck:ratchet`
8. `node scripts/implementation-packets.mjs validate`

⛔ **The two dist-gated byte arms are deliberately NOT in `checks`** (the chair's Q7 ruling at EM-B1k2, 2026-09-20): `describe.runIf(DIST_EXISTS)` means a sealed run with no dist **skips** them and `check:packet` exits 0 on a proof that never executed. The byte proof is §8 step 8's real build plus `VERIFY_DIST=1`, and its receipt quotes the executed figures. §13 Q3 offers the chair the alternative.

⛔ Every gated line goes through the mutex, SHARED tier, worker-capped, with **both** exports spelled inline: `GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run …`. **A gate line with no printed test count DID NOT RUN.**

## 11. Mandatory STOP conditions

1. The 525-row digest is anything but `318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18`, or the probe cannot run.
2. Either golden or the preset witness moves a byte. `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` are FORBIDDEN.
3. Any moved declaration is not byte-identical to its pre-edit text.
4. `BASELINE_EDGES` would need to change, or the live edge count is anything but 5.
5. The real build moves a third module, or the worker rises more than 184 B, or the lazy engine reaches 679,000.
6. `grep -c` on either of EP-0's NC-1 strings returns anything but 1 after the edit.
7. Any register in §7.1 moves against its measured "NOT OWED".
8. A gate line prints no test count, or a dist-gated arm reports a skip where a figure was promised.
9. Anything owner-gated appears (schema, persisted shape, security posture, paid surface, a new capability).

## 12. Completion receipt

The receipt quotes, as executed output: the K-gate hashes and the two golden hashes before and after; the 525-row digest before the edit and after, with the row count and the zero disagreement count; the verbatim diff of the three moved declarations (zero bytes) and the absence check on the remainder; the effective-line pair 280 → 259 and the leaf's 22; `grep -c` = 1 for each of EP-0's two NC-1 strings; every `checks` line with its printed test count; the lighting walker's tuple with **this packet's delta of 0/0/0/0/0**; the build's per-module attribution naming **exactly two** moved modules with their rendered lengths; the worker and lazy-engine figures with the dist they were read from (or an explicit statement that an arm skipped); and, if the ceiling was re-minted, the old and new constants with the dated attribution comment. Judgment calls are named with the alternative rejected and how to reverse them.

## 13. Questions only the chair can answer

**Q1 — THE FROZEN SET DOES NOT SHRINK; the charter says it does.** Measured: `BASELINE_EDGES` names 4 files / 5 specifiers, none of them `economyReconciliation.js`, and no `src/domain/**` file imports the fingerprint today. EM-R0f retires **zero** rows. **Recommendation:** accept the packet as a **PREVENTIVE** member and re-cut the charter's clause from *"the frozen set SHRINKS, never grows"* to *"the frozen set is UNCHANGED at 4 files / 5 edges, and this member is the reason it will not grow to five when EM-R0c lands"*. Nothing in the ruling's reasoning depends on a shrink.

**Q2 — does §6.4's correction TIGHTEN the cardinality arm?** `:159`'s title says "exactly the 6 known edges" and `:164` asserts `<= 6` against a live count of **5** — one unit of slack in a set whose header says it can only shrink. **Recommendation: YES** — retitle to name 4 files / 5 edges and tighten to `toBeLessThanOrEqual(5)`. It is a shrink of a shrink-only ratchet, the measurement is its receipt, and the per-file arm already reds any new importer, so nothing lawful is newly blocked. If the chair prefers strict "prose only", the title must instead be reworded to stop claiming six while the arm keeps its slack and a comment names it.

**Q3 — do the two dist-gated byte arms belong in `checks`?** EM-P3 (2026-09-19) put them in; EM-B1k2's Q7 (2026-09-20) took them out because a skipped arm is not a pass. **Recommendation:** keep them OUT (as drafted) and make §8 step 8's build + `VERIFY_DIST=1` the proof, since the worker ceiling is zero-slack and a silent skip there is the exact false-green §P2 row 11 names.

**Q4 — is `ECONOMY_FINGERPRINT_VERSION` exported from the new leaf?** Nothing reads it today. **Recommendation: NO** — keep the move minimal and private. If EM-R0c needs the version string to tag a recomputed fingerprint, R0c adds the export in its own commit, where the consumer is visible.

**Q5 — does EM-R0c's row need amending now that the fingerprint's address changes?** R0c was compiled at `32602dc60`, before R0f existed. Its merge must import `src/data/economyFingerprint.js`, not the generator. **Recommendation:** the chair adds one line to R0c's §5 naming the new home, so R0c's pre-proof re-finds it by symbol rather than inheriting the old address.

**Q6 — the worker ceiling's re-mint authority.** EM-P3's +80 B rise rode "the standing conditional ruling of ODQ §934.19 addendum 2". **Recommendation:** confirm that ruling covers EM-R0f's ≤184 B, with the same duty to attribute per module and offer the rise for ratification. If it does not, §8 step 8 becomes a STOP-and-report instead of a re-mint.
