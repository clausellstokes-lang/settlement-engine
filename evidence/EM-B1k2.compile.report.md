# EM-B1k2 — COMPILE REPORT (Opus COMPILE lane, 2026-09-20)

## STATUS: **DRAFT, READY-able** — with one contract re-shaped by measurement, put to the chair as Q1/Q2 rather than adjudicated

Not BLOCKED: no premise that the packet's OUTCOME rests on is refuted. Three premises the launch file carried **are** refuted, each with the smallest measured contradiction (§1.1 of the packet, evidence §5), and each makes the packet **smaller and better-evidenced**, not impossible. Not STOP-AND-SPLIT: the budget is comfortably inside every limit.

## The four files

- `$SP/lane-em-compile-EM-B1k2-scratch/EM-B1k2.md`
- `$SP/lane-em-compile-EM-B1k2-scratch/EM-B1k2.manifest.json`
- `$SP/lane-em-compile-EM-B1k2-scratch/EM-B1k2.evidence.md`
- `$SP/lane-em-compile-EM-B1k2-scratch/EM-B1k2.compile.report.md` (this file)

Probes, all copied or written into the same scratch and run from the read tree: `tickstart-probe.mjs`, `tickstart-probe2.mjs`, `arms-probe.mjs`, `efflines.mjs`, `eager-probe.mjs`, `eager-path.mjs`, `closure-membership.mjs`, `stub-loader.mjs`.

## Tree state — opening and closing

```
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD   →  32602dc607b7423838249cf57d73baf08feb047d   (both times)
$ git -C $SP/read-tip-32602dc60 status --short   →  (empty)                                    (both times)
```
Nothing edited, staged or committed on any tree. No gate, no vitest, no eslint CLI, no npm script, no estate check script was run.

## The budget table

| Limit | Budget | This packet |
|---|---:|---:|
| Behavior families | 1 | **1** |
| New persisted families · writers · flags · surfaces | 0 or 1 | **0 · 0 · 0 · 0** |
| New logic-bearing production leaves | ≤2 | **0** |
| ⭐ Existing logic-bearing production files modified | ≤3 | **1** (+3 comment-only rows — **Q1**) |
| Additional registration-only files | ≤3 | **0** |
| Handwritten files total | ≤12 | **6** |
| New/changed effective production lines | ≤400 | **0** |
| Effective lines per new leaf | ≤250 | ≤250 (one new test file) |
| Delta in a shared/hot file | ≤15 | **0** |
| Acceptance cases | ≤8 | **8** |

Effective lines, eslint's own `Linter` (`max-lines`, `skipBlankLines`+`skipComments`): `factionDensityKernel.js` **395** / 800 · `settlementLifecycleFirstClass.js` **462** / 800 · `successorNpc.js` **50** / 800 · `roadsKernel.js` **838** against its `scripts/.size-baseline.json` **838** — ⛔ tolerance-zero in **both** directions, which is why its row is comment-only. All four edits are **+0**.

## Register moves — every one a DELTA

- **Lighting census:** `+1 files / +0 parked / +1 credited / +5 titles / +1 suiteTitles`. One new CREDITED test file (opener from `'vitest'`, ONE literal `describe`, five straight-line literal `it`); **zero** new titles in `roadsParticipation.test.js` because A3 extends the existing exactness arm. A named INTERIOR RED; the chair re-derives the whole tuple at the terminal. ⛔ No absolute tuple appears anywhere in the packet.
- **The `.npcs` reader ratchet:** `41 → 42` files, the one new member `src/domain/density/factionLifecycle.js`, re-measured at this tip. `UNDISPOSITIONED_NPCS_READERS` and `UNDISPOSITIONED_CEILING = 7` byte-identical.
- **Mutation-coverage · edge-shared · prose-numerics · wiring-census · tuning register · `path:line` citations:** all **measured NEGATIVE**, and every one lives in §7.1's ledger, never as a table row.
- **observed-shape · writer-reach:** predicted **no move**, labelled PLAUSIBLE (a lane runs no estate script); both are in `checks` and motion is a STOP.

## The collision group

**EM-B1k** — and the reason is structural, not stylistic. EM-B1k's placed §7 `TEST` row edits `tests/domain/roadsParticipation.test.js` (its A3 and A5 in the master-gate describe); this packet's `TEST` row edits the ratchet block of the same file. `PACKET_STANDARD.md` ("Validator status-sequence simulation") reserves a change path at **every non-terminal status, DRAFT included**, so two live packets on that path red `validate:packets`. ⇒ ⛔ **EM-B1k2 may be PLACED ONLY AFTER EM-B1k IS `LANDED`, and its pre-proof re-runs at that tip.** Everything else is clear: of the 190 manifest entries only `EP-3A`, `EP-3B` and `EM-B1d` name any path here, all three LANDED.

## The §7 table and the JSON manifest, proved set-equal

`PACKET_ACTIONS` printed from `scripts/implementation-packets.mjs:30`: `["CREATE","DOC","MODIFY","REGISTER","TEST"]`.

```
§7 TABLE rows (6)                                      JSON rows (6)
  MODIFY src/domain/worldPulse/factionDensityKernel.js
  MODIFY src/domain/worldPulse/settlementLifecycleFirstClass.js
  MODIFY src/domain/worldPulse/successorNpc.js
  MODIFY src/domain/worldPulse/roadsKernel.js
  CREATE tests/domain/irreversibleRawRoster.test.js
  TEST   tests/domain/roadsParticipation.test.js
SET-EQUAL: YES · rows with an action outside PACKET_ACTIONS: 0
acceptanceCases: 8, all {id, case} · checks: 11 argv arrays · requiredSymbols: 16 · retiredSymbols: 0 · symbol in both lists: 0
```

`requiredSymbols`: sixteen rows, **each proven present by a quoted `grep -cF` = 1** (evidence §7), and each surviving the post-edit simulation — thirteen sit in files this packet does not touch or touches only by comment; `advanceFactionDensity` and `foundReaders` are edited **inside** their bodies and their declarations survive verbatim; `UNDISPOSITIONED_NPCS_READERS` is byte-identical by contract. `retiredSymbols` is empty **and proven so**: the packet replaces the INITIALIZER of `const tickStart`, not any named symbol, and that line text is a `requiredSymbols` row of no packet in the 190-entry register.

## The first-paint delta of `successorNpc.js`, priced

`successorNpc.js` **is** in `EAGER_FIRST_PAINT_MODULES` (measured against `vite.config.js`'s own derivation — 268 modules) and its siblings are not; the path is `main.jsx → store/index.js → settlementSlice.js → events/mutateEntities.js → successorNpc.js`, four hops. The budget is `CLOSURE_BUDGET_BYTES = 1_048_000` and the newest figure the test's own header records is **1,047,205** ⇒ ≈**795 B** of margin, with raises **OWNER-SIGNED** by that file's whole history. ⇒ ⛔ **The packet prices it at 0 B and contracts it there**: the row is comment-only, comments are stripped by the production build, and the comment is forbidden to carry `/*!`, `@license` or `@preserve` (which survive minification). Any attributed movement for that module is a §11 STOP. The lazy `engine` chunk (`< 679_000`, 869 B of recorded margin) takes `factionDensityKernel.js`'s one token-level replacement, bounded at **≤200 B**. The ZERO-SLACK generation worker takes **0 B, proven by the import graph** — none of the four is in its 220-module closure. The advance worker takes a DELTA under TOOL-3's 4 KB per-train headroom, no per-packet re-mint.

## What the measurements changed

1. ⭐ **The core finding, executed.** With EM-B1k's raw write base modelled in memory, over a 7-town corpus stride: the dissolution reaction is **PRODUCED 7 / 7 from the filtered `tickStart` and 0 / 7 from the raw one**, while the chain's `{changed, newsEntries, settlementUpdates}` is **identical** in both runs and the 6 legitimate `faction_dissolved` beats fire identically (the non-vacuity control). So the packet is real defence-in-depth **and** provably behaviour-neutral.
2. ⛔ **A second, sharper reason the habitat matters.** `fresh` FALLS BACK to `tickStart` when an update entry carries no `.settlement` (`:721-723`). Driven that way, the shelved sole member's house is dissolved **7 / 7 even with EM-B1k's raw write base**. EM-B1k's refusal therefore rests on an invariant nothing pins ("every update entry carries `.settlement`"); this packet removes the dependency. (That the fallback is unreachable in production is PLAUSIBLE, not confirmed — `applyWorldPulse.js:609` replaces an entry wholesale from another producer.)
3. ⛔ **The launch's outcome 2 is NOT EXPRESSIBLE as worded.** Neither `applySettlementLifecycleOutcomeToSettlement(settlement, outcome)` nor `replaceOustedNpcs(settlement, oustedNames, rng)` receives a save, so neither can "read RAW explicitly"; and both their callers — `applyWorldPulse.js:733` (from `buildSettlementMap`) and `npcVerdictPulse.js:133` ← `pulseKernel.js:617` (from `localSettlements`) — are made raw **by EM-B1k and by nothing else**. Executed, both writers handed the participation view **drop the off-stage soul** (`roster out 2 | the shelved soul present: false`) and handed the raw one carry them (`3 | true`). ⇒ The cure available is the **contract comment + the census disposition + the pin**, which is what the packet contracts. **Q1/Q2.**
4. ⛔ **"Currently unreachable" is FALSE for both.** `settlementLifecycleEnabled` is a `WAVES` virtual key **lit in all four presets including the default `realistic_regional`**, and `advanceNpcCorruption` — the sole producer of `kind: 'ousted'` — is called **unconditionally** at `pulseKernel.js:388`. Both lanes are LIVE, so A5 and A6 are driven at real triggers, not at a function boundary. **Q3.**
5. ⚠ **The census tells two lies today, and the packet fixes both.** `settlementLifecycleFirstClass.js` and `successorNpc.js` carry **no** disposition and inherit the blanket *"everything else is via-snapshot (protected by the gate, no edit)"* — false for both. And `factionDensityKernel.js`'s `TE-DENSITY-1` disposition is about `applyCadence` only, so the lifecycle read inherits the same blanket; worse, that clause is **aspirational at this tip** (it claims `fresh` is the raw saved copy, which becomes true only with EM-B1k).
6. ⭐ **The `tests/` sweep found the trap and it is benign.** `tests/generators/densityLaw.test.js` drives `advanceFactionDensity` **13 times** through a `snapOf` that builds items **without `save`**, so every drive falls through the `||` — byte-identical under the cure, **no fixture reds**. The corollary is contracted into the CREATE row: a `save`-less item exercises the fallback, so the new suite must build items **with** `save` or it proves nothing.

## Questions only the chair can answer — numbered, not waited on

1. **Q1 — THE BUDGET QUESTION, re-shaped.** The packet reads **1 logic-bearing production file + 3 comment-only rows**. ⭐ **Recommendation: count comment-only rows as NOT logic-bearing**, on LANDED `EM-B1d`'s precedent (a `MODIFY` row marked *"⛔ COMMENT ONLY — THE FROZEN ARRAY IS BYTE-IDENTICAL"*) and on `EP-3A`'s note that `roadsKernel.js` is tolerance-zero both directions so a comment is the only lawful edit into it. If refused, drop order: `roadsKernel.js` first, then `successorNpc.js` (the only EAGER file), each re-slotted where that file is next edited.
2. **Q2 — is a comment-only contract what "cured with the class" meant?** ⭐ **Recommendation: keep the comments.** The census speaks to a lane adding a NEW `.npcs` reader; it says nothing to a lane editing an EXISTING writer's caller, and the comment sits where that lane reads. Cost: zero lines, zero rendered bytes.
3. **Q3 — confirm A5/A6 at the REAL triggers** now that "unreachable" is refuted (finding 4), rather than at the function boundary the launch allowed as a fallback.
4. **Q4 — the name join.** `replaceOustedNpcs` matches by display name; under a raw base it can now reach off-stage people. **0 duplicate names across 7 towns / 63 rostered NPCs** at stride 75 — a small sample. Full-corpus name census, a cure packet (thread `exposure.npcId` and join on `npcId`), or CLOSED-with-reason?
5. **Q5 — the legacy save shape.** When `save.settlement` is absent, both EM-B1k's `:184` and this packet's `:699` fall back to the participation view. Deliberately not diverged from EM-B1k. Measure the save corpus, or accept and record?
6. **Q6 — `EXPECTED` vs the quarantine** for `src/domain/density/factionLifecycle.js`. The packet puts it in `EXPECTED` **with** a written disposition (the quarantine route would leave `UNDISPOSITIONED_CEILING` at 7 with an eighth member). Confirm.
7. **Q7 — the dist-gated byte arms in sealed `checks`.** `tests/build/vendorPdfLazy.test.js` and `generationWorkerLazy.test.js` are `skipIf(!requireDistRead)` and measure nothing until a real build has run. They are LAST in `checks`. Confirm the chair wants them sealed there rather than only in the build lane's narrative.
8. **Q8 — EM-B1k's §5 carries a stale address.** It cites `roadsKernel.js`'s merge as `const fullRoster` (`:395`-ish); it is at **`:425`** at this tip, and the comment in question is at `:1094-1096`. EM-B1k's `requiredSymbols` names the symbol, so nothing is broken — but the hint is wrong in a READY packet.

## ⛔ EVERYTHING NOTICED AND NOT TOUCHED — each specific enough to slot

1. **The legacy save shape is still filtered on BOTH packets.** `saveSettlement`'s fallback (`save?.settlement || save`) means a save without `.settlement` keeps the participation view at EM-B1k's `:184`, EM-B1k's `:579` and this packet's `:699`. Whether any shipped save carries that shape is **unmeasured**. → **Slot: Q5 — a one-command save-corpus measurement, or CLOSED-with-reason.**
2. **`replaceOustedNpcs` joins by NAME (`successorNpc.js:65`, `:70`), not identity.** Under a raw base it can now see off-stage people; a duplicate display name replaces the wrong soul. 0 duplicates at stride 75 (7 towns / 63 NPCs). → **Slot: Q4 — a cure packet threading `exposure.npcId` from `npcVerdictPulse.js:133`, or CLOSED after a full-corpus name census.**
3. **`src/generators/density/titularSuccession.js` calls `factionRosterOf` and has no importer in `src/`** (RECON-STAGE §2.1; not re-measured here). Dark, and it will read whatever settlement its future caller passes — i.e. it is a future member of exactly this class, and it sits OUTSIDE the widened ratchet's three roots (`src/generators/**`). → **Slot: either the packet that wires it owes the raw-base disposition, or a lane burns the dead module, or the ratchet gains a fourth root.**
4. **`tests/store` is not an `ENFORCER_DIR` and `NAME_PATTERN` does not match `participationWriteBase`** — re-measured true. EM-B1k's regression suite (the estate's most load-bearing new one) and this packet's both owe no mutation-coverage row. → **Slot: the chair's standing `ENFORCER_DIRS` question (EM-B1k §13 Q3).**
5. **`factionDensityKernel.js`'s `TE-DENSITY-1` census disposition is ASPIRATIONAL at this tip.** It states `applyCadence` reads *"the RAW roster of `fresh` — the freshest SAVED copy the write lands on"*; until EM-B1k lands, `fresh` descends from the participation view. → **Slot: this packet's own §6.3 rewrite states it; nothing further owed.**
6. **The first-paint closure's LIVE margin is unknown.** The newest recorded figure is 1,047,205 / 1,048,000 (2026-09-01, T13); EM-P0's raise note says the arm was *green* at `023eda2ec` without printing a number. Every EM member that touches an eager module is pricing against a figure three weeks old. → **Slot: the next real build records it in the test's header, or a chair measurement lane.**
7. **`tests/build/vendorPdfLazy.test.js`'s byte arms are `skipIf(!requireDistRead)`** — a focused run that skips them is not evidence about bytes, and a receipt could read a skip as a pass. → **Slot: worth one sentence in `EM-PREAMBLE.md` §P2.11.**
8. **EM-B1k's §5 `roadsKernel.js` row carries a stale `:395`-ish address** (the symbol is at `:425`). → **Slot: Q8 — a one-token correction at EM-B1k's placement, or leave it (the row names the symbol).**
9. **`applyWorldPulse.js:609` replaces a `settlementUpdates` entry WHOLESALE** (`settlementUpdates.set(String(entry.saveId), entry)`) from a priced producer, so an entry without `.settlement` is not obviously impossible — which is what makes §0's fallback hole a live question rather than a theoretical one. Not traced to its producer here. → **Slot: a 20-minute recon on `priced.settlementUpdates`' producer, or CLOSED once A4 pins the fallback anyway.**
10. **`src/domain/density/factionLifecycle.js` is itself EAGER** (measured: in `EAGER_FIRST_PAINT_MODULES`, via the `ENGINE_SHARED_DOMAIN` seeds, not via `main.jsx`). This packet does not edit it, so it costs nothing here — but any future packet that does is spending owner-signed first-paint headroom on the density vocabulary. → **Slot: a line in the EM preamble's byte row, or the next packet that touches it.**

## Labelling

**CONFIRMED** (command + output quoted in the evidence): the tree state and the empty J-T1 window; the preamble SHA at both tips; the CREATE target's absence; `item` and `reading`'s usage inside `advanceFactionDensity`; the participation view differing from the raw settlement in `npcs` alone; the 7 / 7 → 0 / 7 reaction measurement and the zero chain drift; the 7 / 7 fallback dissolution; both permanent writers' signatures, their callers' bases, their reachability, and their measured both-direction behaviour; all four effective-line figures and `roadsKernel.js`'s tolerance-zero baseline; the four chunk closures and the eager path; zero edge-shared input membership; 41 → 42 with exactly one new conviction; every register negative; the 13 `snapOf` drives falling through the `||`; all sixteen `grep -cF` = 1; the empty `retiredSymbols` proof over the 190-entry manifest; the set-equality of §7 and the JSON.

**PLAUSIBLE**, and labelled where it appears: that the fallback arm is unreachable in production; that a comment-only edit renders zero bytes (the packet makes it a STOP condition instead of an assumption); that the observed-shape and writer-reach registers do not move (both in `checks`, motion is a STOP); that 1,047,205 / 678,131 are still the live byte figures; and that the walker's own `parkReasonsFor` prints `[]` for `roadsParticipation.test.js` (structurally credited by inspection — the pre-proof should execute it, though the packet's delta claims zero new titles in that file regardless).

**NOT ADJUDICATED:** the budget reading for comment-only rows, the shape of the "cure" for the two permanent writers, and every other item in the numbered list above. Those are the chair's.
