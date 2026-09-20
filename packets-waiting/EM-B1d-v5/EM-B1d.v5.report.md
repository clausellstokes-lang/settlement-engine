# EM-B1d version 5 — the lane's report to the chair (phase 1)

**Drafted, not placed.** Four files in `$SP/lane-EM-B1d-build-scratch/v5/`:
`EM-B1d.md` · `EM-B1d.manifest.json` · `EM-B1d.v5.evidence.md` · this report. Plus the three
scratch measurers they cite (`measure-placement.mjs`, `simulate-v5.mjs`, `build-manifest.mjs`) and
their captured output (`placement.out`, `simulation.out`, `table-json-equality.out`).

**The slot's tree was not touched.** Phase 1 ran `node` and `git` read-only commands; no vitest, no
eslint, no build, no write under `$SP/lane-em-b3b`. `git status --short` still shows exactly the
eleven version-4 paths, staged, at HEAD `58fcfe614`.

---

## 1 · The ruling's open question, answered: put it in `npcs.js`

⭐ **RECOMMENDATION: `NPC_UNAVAILABLE_STATUSES` is minted in `src/domain/entities/npcs.js`**,
immediately above `IMPORTANCE_WEIGHT`.

**The zero-slack budget cannot be touched, and it is a membership fact rather than a bet on
rollup.** `npcs.js` is **absent from the generation worker's 220-module static closure**, and — a
separate measurement, because they are separate claims — **no module inside that closure imports
it**. `status.js` measures identically. So:

> **The tree-shaking question is MOOT BY PLACEMENT.** The chair asked whether the worker's build
> would drop an unused export; it never gets the chance, because the module is not in the chunk.
> I deliberately did **not** rely on the weaker, shake-dependent answer: against an EXACT ceiling
> with zero slack, a packet that needs rollup to behave a particular way is one refactor from a
> re-mint. A1 now **asserts the home**, so a later relocation re-prices §3.2 instead of discovering
> the ceiling at a terminal.

All three candidates (`npcs.js`, `status.js`, a new `npcAvailability.js` leaf) are **budget-identical**
— none in the worker, none under `/src/generators/`, all three in first paint and in
`advanceInterval.worker` (which has **no byte ceiling**; the `advanceWorkerByteIdentity` pin is a
structured-clone determinism pin, not a bundle ceiling). So the choice falls to coupling, and
`npcs.js` wins outright:

- it is the typedef's own home, and the vocabulary is a projection of the union;
- **`envoyCasting.js` already imports `npcs.js`** (`importanceWeight`, line 50), so row 4 adds **no
  import line and no new module edge at all**;
- `successors.js` is in the same directory and its one new edge is **closure-neutral by
  construction** (both modules already in `EAGER_FIRST_PAINT_MODULES`, a fixpoint);
- ⭐ **the `entities → density` edge version 4 was forced to add disappears**, and the
  `worldPulse → density` edge is never added at all;
- a new leaf would cost a file and a module node to buy nothing measurable.

First-paint cost: the constant minifies to roughly 50 B, and the same `successors.js` substitution
measured **−5 B** across the whole closure in version 4. The packet carries a **≤ 60 B** bound
against **8,770 B** of measured margin, and §8 step 8 makes the build lane measure it.

## 2 · The ruling, re-derived: R6′ survives untouched

Simulated from the **base blobs** with the v5 edits applied in memory (never the dirty worktree):

- **TRIGGER = `{dead, exiled, retired}` — unchanged.** The re-cut does not disturb the matcher.
- **FLAGGED = 6**, and the roster's **6 `literals` rows** are set-equal to it, both directions.
- **Discovered enumerators: 2 → 3** — `npcs.js` joins, as the vocabulary's home. Its roster row
  enumerates `dead, exiled, jailed, removed` and carries the reasoned omission for `missing` and
  `retired`.
- **Exemption register: still empty**, inline, its checker proved on a planted row.
- `factionLifecycle.js`'s row enumerates `dead, exiled, removed` with the omission naming `active`,
  `jailed`, `missing`, `retired` as **PRESENT BY R18**.

⛔ **One derivation rule had to be corrected, and its own failure is the proof.** The first
simulation reported `missing` with **four** foreign vocabularies, because `envoyCasting.js`'s derived
`UNAVAILABLE_STATUSES` was counting **itself** as foreign. The rule is now *a vocabulary declared
inside a declared consumer-roster file is this union's OWN, never foreign* — with it the homonym
table reproduces the original measurement exactly (11 / 8 / 3 / 3). It is now §6 contract text.

## 3 · The addendum, discharged

`§7 table 16 rows ≡ JSON changeManifest 16 rows — SET-EQUAL BOTH DIRECTIONS: YES`, printed by a
scratch script that parses the table **by its column names**. Also printed and clean: no action
outside `PACKET_ACTIONS` (`REGENERATE` is gone — generated artifacts are `MODIFY` on both sides), no
bare basename, no multi-path cell, no duplicate path, and **no `.lighting-census-baseline.json`
row** — it is prose under §7, with the reason (§P2 row 1 forbids a member from editing it, so a row
would be an instruction to break the law it cites). The seven `_shared` artifacts are seven rows.

## 4 · Both of the chair's reading questions

**(a) Is the espionage refusal still reached through `UNAVAILABLE_STATUSES`? YES**, by reading:
the derived set is `{dead, exiled, jailed, removed, missing}`, the re-spelled fixture is `'jailed'`,
`rosterPersonAvailable` lowercases and finds it, returns false, and `castableRoster` skips the
person — so the suite's `toEqual([])` holds. The fixture's two siblings are refused on the travel
arm and on `'dead'` respectively, both unchanged. ⛔ Note the near-miss: had `jailed` been left out
of the availability vocabulary, this fixture could have gone green by accident on the `isOffStage`
arm; mutant **M2′** is what keeps that honest.

**(b) The `densityLaw` `it`** needs no new import — `house`, `figure`, `v2Cfg`, `isOnRoster`,
`factionLifecycleStateOf` and `readFactionLifecycle` are all already in scope. Its `not.toContain`
carries a one-line `// anchored:` marker naming the sibling exact-equality pin as its liveness
anchor, per the marker rule.

## 5 · Budgets

**+3 effective production lines of ≤15** (npcs +1, factionLifecycle **+0 — comment only**,
successors +1, envoyCasting +1, magicForms +0), each row ≤3. ⭐ Version 5 is cheaper than version 4
in envoyCasting (+1 rather than +2) because no import line is needed. Walker **~235 projected** of
≤250 (v4 executed 232). **Handwritten 9 of ≤12; generated 7.** Lighting delta
**+1 / +0 / +1 / +5 / +1**; predicted whole tuple `2649 · 383 · 2266 · 25020 · 6676`.

## 6 · Decisions I took inside the draft, for veto

1. ⭐ **SIX mutants, not five.** The ruling replaced M1 with its inverse and created a new constant
   that needs its own plant (**M2′**, `NPC_UNAVAILABLE_STATUSES` loses `jailed`). Dropping version
   4's `LOST_NPC_STATUS` plant to stay at five would leave `magicFormsPractitioner.js` unplanted
   after it had already convicted, so I kept it as **M6**. Six plants, each with a named target, in
   §9.
2. **`requiredSymbols` is 17 rows**, including the two mint anchors (`const IMPORTANCE_WEIGHT = {`,
   `const IDENTITY_SEPARATOR`) and the two TEST anchors. ⛔ `NPC_UNAVAILABLE_STATUSES` is **not**
   among them: a READY packet names only what its deliverable PRESERVES; it is added at the flip.
3. **`densityLaw.test.js`'s new `it` cannot be written failing-first** in the ordinary way, because
   `isOnRoster({status:'jailed'})` is *already* true at the base — the pin exists to stop a future
   lane moving the array. §8 step 5 says so plainly and routes its proof through mutant **M1′**
   instead of pretending to a red the tree cannot produce.
4. The packet keeps **`Verified base` / `Last revalidated` as `__BASE__`** and writes the six-point
   re-measurement out as an instruction for the chair to execute in the same command as the stamp.

## 7 · Noticed while drafting, not acted on

- The version-4 packet's §3.2 quoted the worker ceiling as `1401128`; the live constant is
  **`1401208`**. Corrected in v5 housekeeping.
- The version-4 first-paint reading (`1,047,205`, "~795 B of margin") was **stale by ~8 kB**; the
  measured base figure is `1,039,235` with **8,770 B** of margin. Corrected.
- `EM-PREAMBLE.md` §P2 still owes **row 12** (the generator re-stamps every sibling meta and the
  estate pins one build window). v5 §3.3 states it locally; the chair's own commit is the proper
  home, and it is carried in §12.1.
