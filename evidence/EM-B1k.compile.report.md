# EM-B1k — Opus COMPILE lane report (2026-09-19)

## Verdict

**DRAFT — READY-able in one pass**, with **one declared STOP AND SPLIT** at the chair's own seam
(§0), which the measurement turned into good news rather than a cost.

Tree `$SP/read-tip-e5bdfd031`, `rev-parse HEAD` → `e5bdfd03176b402e777f2681187b49db47ab43c5`,
`git status --short` **empty at start and end**. Nothing edited, staged or committed on any tree;
plain `node` only. Preamble hash re-verified.

**Files** (all under `$SP/lane-em-compile-EM-B1k-scratch/`): `EM-B1k.md` · `EM-B1k.manifest.json`
(parses; 3 change rows, 7 requiredSymbols, 7 `{id, case}` acceptance cases, 10 checks, no action
outside `PACKET_ACTIONS`, **§7 table ↔ JSON set-equal 3 = 3**, **no generator in `checks`**) ·
`EM-B1k.evidence.md` · this report. Measurers: `cure-simulation.mjs`, `old-saves-hold.mjs`,
`f2-roads-lit-repro.mjs` (+ the recon's `f2-dm-repro`, `population-at-risk`, `consumer-sweep`).

---

## ⭐ The measurement that shaped the packet: cure (1) ALONE stops BOTH defects

Leaving the snapshot **filtered** (participation reads untouched) and changing **only** the
update's settlement to the raw save settlement, with `factionDensityKernel` **unpatched**:

```
ACTIVE sole Weaver (control)              | write base: filtered | houses: ["The Crown","The Weavers"] | roster: 2 | beats: []
SHELVED sole Weaver — TODAY               | write base: filtered | houses: ["The Crown"]               | roster: 1 | beats: ["faction_dissolved"]
SHELVED sole Weaver — AFTER CURE (1) ONLY | write base: raw      | houses: ["The Crown","The Weavers"] | roster: 2 | beats: []
HOSTAGE sole Weaver — AFTER CURE (1) ONLY | write base: raw      | houses: ["The Crown","The Weavers"] | roster: 2 | beats: []
```

The reason is in the tree's own words at `factionDensityKernel.js:258-262`: *"An irreversible
consequence may only fire on a fact that is still true at the moment it is applied."* **That guard
was correct all along and failed only because `fresh` was filtered too.** Give it a raw base and it
refuses the dissolution by itself.

⇒ the split the budget forces is also the safe one: **EM-B1k stops the data loss and the
dissolution; EM-B1k2 removes the habitat** (cures 2 and 3), because `tickStart` at `:704` still
*reads* the filtered view and merely has its reaction refused.

## The seam's exact contract, and the per-writer merge rule

⭐ **The merge rule already exists in the tree.** `roadsKernel`'s `fullRoster` is exactly what the
chair specified — *iterate the RAW roster; take the tick's version of each person by `npcId` when
it has one, else the raw one* — and the roads lane wrote it because **it had already been bitten by
this defect** (`:1094-1096`: *"the update dropped an off-stage NPC roads must keep … so a hostage is
never lost even under a naive save merge"*). It does not cure the estate because it is lane-local
and doubly gated on `roadsActive` **and** a spatial digest (`:342-348`) — confirmed: the DM
reproduction loses the person **with `roadsEnabled: true` as well as without**.

Under the contract the update's roster is raw **from birth**, so there is one roster again and
every mover's own write lands on it: arrivals append (`factionDensityKernel:602`,
`magicFormsPractitioner:250`), replacements replace (`npcVerdictPulse:142`,
`factionDensityKernel:647`), per-person marks map (`applyWorldPulseBetrayal:51`, `npcAgency:235`,
`npcGrowthKernel:597`), and `roadsKernel:1102` becomes redundant. **The defensive rule for any
wholesale roster replacement is `fullRoster`'s algorithm**, asserted by A4 in both directions.

**The one risk, stated so it can be refused:** those three `.map` writers iterate an index and will
see **more people** under a raw base. All three compute from `worldState` keyed by `npcId` rather
than from position, so the expected effect is a refreshed mark, not a miscomputation — **PLAUSIBLE,
and A5 is the arm that must prove it.** If A5 reds, that is the packet's STOP.

## ⛔ The binding constraint nobody had priced: the file is AT its ceiling

```sh
$ node -e "…scripts/.size-baseline.json…"  src/domain/worldPulse/pulseKernel.js => 1581
$ node -e "…eslint Linter…"                pulseKernel.js effective lines: 1581
```
**1581 / 1581 — zero headroom**, pinned by `tests/lint/sizeBaseline.test.js`. So the cure is
contracted as **two single-line replacements and no additions** (§6), with A7 asserting the count
is 1581 again afterwards. A helper, a guard line or a reformat is a STOP.

## Acceptance arms with today's reds quoted

A1 the DM's own act — required: **7 of 7 persisted and `return-npc` succeeds**; red today:
`store 6 of 7 / DB 6 of 7` and `{"ok":false,"status":"failed","reason":"npc_target_missing"}`.
A2 a hostage — ⚠ stated as the *smallest lawful construction* (the mover's own shape from
`roadsKernel:1073`), not a claim the mover ran, because it needs a digest and rolls across ticks.
A3 a sole-member house survives — red today: `houses: ["The Crown"]`, `beats: ["faction_dissolved"]`.
A4 the merge loses nothing (death + arrival + off-stage person, all three at once), including the
`npcId` positional-fallback pin. A5 the participation reads are unchanged. A6 nothing moves,
executed. A7 the ceiling held.

**How the build lane reaches the real store commit without my loader stub:** vitest runs through
Vite, so `import.meta.env` is defined and `src/lib/supabase.js` loads unchanged;
`vite.config.js:894-898` sets `environment: 'node'`, which is all store logic needs. The model is
`tests/store/wizardNewsCommitReconcile.test.js`.

## Bundle and register pricing

**Zero into the zero-slack generation worker; zero into first paint** (`pulseKernel.js` is not
eager). In `advanceInterval.worker`, which has **no ceiling today** — priced as a DELTA against
TOOL-3's 4 KB per-train headroom, **no per-packet re-mint** (Q3). ⭐ **`pulseKernel.js` is an INPUT
of neither edge-shared bundle**, so the packet owes **no `_shared` rows and no generator in
`checks`** — `worldSnapshot.js` is the input of both and this packet deliberately does not touch
it. Registers: `.size-baseline.json` is the binding one; `.tuning-inventory.json` is line-addressed
but keys on `spanDigest` and a net-zero edit moves no line; `wiring-census` `stamp.files` names
none of the candidates. **Mutation-coverage: NOT owed, measured** — `ENFORCER_DIRS` has no
`tests/store` and `participationWriteBase` matches no `NAME_PATTERN` token (kept in the §7 table as
a measured negative, absent from the JSON). Lighting DELTA:
**`+1 files / +0 parked / +1 credited / +5 titles / +1 suiteTitles`**, no absolute quoted.

## The widened ratchet (EM-B1k2's, measured here)

`tests/domain/roadsParticipation.test.js:308` greps only `src/domain/worldPulse` and
`src/domain/spatial` (41 files). Adding `src/domain/density` convicts **exactly one new file:
`src/domain/density/factionLifecycle.js`** — one disposition row, not a sweep.

## What old saves hold — for the owner

```
ERASED PERSON: Dorothea Eindriðason / npc_1     persisted roster length: 6
  npcs[] by id              : false      ⛔ the RECORD is gone
  keys that still name them : relationships, factions, pressureSentence
  relationships entries: 12 | relationships name them: true
  factions[].members[]      : [0,0,0,0,0,0]     populationHistory: a count, not a roster
```
**The person's record is unrecoverable** — role, importance, affiliation, personality, secrets,
influence all went with the array entry. What survives is their **name**, in 12 dangling
`relationships` edges pointing at somebody the roster no longer holds, a `factions` mention, and a
rendered `pressureSentence` about a person who does not exist. A repair could restore a name and
re-hang edges; it could not restore the person. The only true rewind is the whole-tick
`pulseUndoStack` snapshot, which is bounded. ⛔ **No repair built** (as instructed).

## Noticed, not touched — each specific enough to slot

1. ⛔ **EM-B1k2** — cures (2) and (3): `factionDensityKernel`'s `tickStart` reads RAW explicitly;
   `settlementLifecycleFirstClass:611` and `successorNpc:66` cured **before either is lit**; the
   ratchet widens to `src/domain/density` and `factionDensityKernel.js`'s census row gains a real
   **irreversible ⇒ RAW** disposition. Slot: immediately after this packet, same train.
2. ⚠ `roadsKernel`'s `fullRoster` compensation becomes redundant; re-point its comment at this
   packet so the next reader does not think it is the estate's only defence. Slot: EM-B1k2.
3. ⚠ `successorNpc.js` is in the **eager first-paint** graph while every sibling is not — any
   packet touching it prices a first-paint delta. Named for EM-B1k2's compile.
4. ⚠ Dangling relationship edges already exist in damaged saves (above). No repair built.
5. ⚠ `tests/store` is **not** an enforcer dir and `NAME_PATTERN` misses `participationWriteBase`,
   so the estate's most load-bearing new regression suite owes no mutation-coverage row. Worth a
   chair look at whether `tests/store` should join `ENFORCER_DIRS`.

## Questions only the chair can answer

- **Q1 — confirm the split** (§0) and EM-B1k2 as chartered in §12.1 item 1.
- **Q2 — the one risk.** If the chair wants it *removed* rather than *proven*, the alternative is
  to keep the base filtered and merge by id at the write-back — but that leaves the dissolution
  live and needs cure (2) in the same packet, which is what the budget refused.
- **Q3 — `tests/store` and `ENFORCER_DIRS`.**
- **Q4 — a repair for damaged saves?** The evidence says exactly what could be recovered.

## Labelling

**CONFIRMED** (command + output in the evidence): the seam and the absence of any re-merge; cure
(1) stopping both defects; `fullRoster` as the existing merge and its two gates; the roads-lit
reproduction still losing the person; the per-writer table; bundle and edge-shared membership; the
1581/1581 ceiling; the one-file ratchet conviction; golden and fixture purity; what old saves hold;
the seven symbol proofs and the free placement.
**PLAUSIBLE**, labelled where it appears: that the three index-mapping movers will merely refresh
an off-stage person's mark rather than miscompute (A5 is the proof); and the reversibility column
for the non-dissolution write-bearing consumers, read rather than executed.
