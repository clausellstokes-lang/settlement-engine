---
name: chronicle-snapshot-shape-fix
description: "ChroniclePanel snapshot-shape fix @ 29f7abc9 — aiSettlement is a generator clone, not AI-shaped; stress is a single object; 4 deferred siblings"
metadata: 
  node_type: memory
  type: project
  originSessionId: 92f0767e-1830-465d-a95e-32b7ccf7be80
  modified: 2026-07-20T00:44:13.591Z
---

**THE SNAPSHOT-SHAPE BUG — shipped 2026-07-19 @ `29f7abc9` on `claude/the-composite`** (atop the faction-key hardening `dc0b6e2b`). Fixed all five record rows in ChroniclePanel's full-entry modal; closure Δ **0 B** (still 1,040,998); UI suite 604/604; revert-proof 8 failed / 3 passed at base.

## The load-bearing mechanism (this kills the obvious hypothesis)

`entry.aiSettlement` is **NOT an AI-authored object**. `generate-narrative` does
`aiClone = deepClone(settlement)` (index.ts:1800) and every per-section `apply()` in
prompts.ts **mutates that clone in place by index** (`target.desc = item.desc`) — minting
no keys and renaming none. So an "AI-generated" chronicle snapshot is **generator-shaped**.
Anyone assuming AI surfaces carry AI-shaped records will fix the wrong thing.

Executed-probe record shapes (`generateSettlementPipeline`):
- `powerStructure.factions` → `[faction, power, desc, category, rawPower, powerLabel]`
- `powerStructure.conflicts` → `[parties, issue, stakes, intensity, desc, plotHooks]`
- `institutions` → `[category, name, desc, tags, ...]`
- `npcs` → `[id, name, role, goal, secret, ...]` (blurb is `goal.short`)
- `stress` → `[type, label, icon, colour, summary, crisisHook, ...]`

The dividing line: collections the AI **mints wholesale** (`identityMarkers` = plain
strings, `frictionPoints` = `{who, what}`) are AI-shaped; collections it only **text-refines
in place** keep generator keys. See [[ladder-faction-key-fold-composite]] for the same class.

## ⚠️ Three hazards that cost real time here

1. **`settlement.stress` is a SINGLE OBJECT, never an array** (probe: 0 arrays / 10 plain
   objects / 30 absent over 40 generations). Any `renderList`-style `Array.isArray` guard
   **drops the row entirely**. Fixing such a row's key spelling alone is cosmetic. The edge
   function normalizes with `Array.isArray(x) ? x : (x ? [x] : [])` — copy that.
2. **`settlement.npcs` mixes TWO record kinds.** Structural office-holders (npcStructure.js
   — `generatedAs`, `importance`, `linkedInstitutionIds`) carry **no goal/secret/desc at
   all** (~1 in 11 NPCs). Any "label: blurb" formatter must tolerate a blurb-less record.
3. **Generation is NOT deterministic per call.** Repeated `generateSettlementPipeline` with
   identical config yields different settlements — `{seed}` in config does not seed it.
   So a test must **derive expectations from the object it renders**, never hard-code a
   seed's output, and must guard on presence for optional collections.

## Deferred, documented, each spawned as a task chip (do NOT re-find as bugs)

- `personaSlicer.js:125` — **CONFIRMED live break**, same class: faction roster always `[]`,
  so every AI persona believes its settlement has no factions.
- `religionLegitimacy.js:208-214` — dead `.name` lookups; masked by an undocumented
  power-ordering coincidence (fallback happened to pick right in 360 gens + 1,440 coups).
  `rulerLens` substantially inert (`.archetype`/`.id` also absent).
- **12 reversed-precedence `.name || .faction` sites** — work today, violate the `nameOf`
  contract dc0b6e2b pinned. Sharpest: `factionRoles.js:134` feeds an identity-bearing slug
  (`:200` in the same file gets it right — internally inconsistent).
- Same modal: `renderSection` **raw-dumps JSON for History and Economic Viability** (both
  objects; `economicViability.summary` is the obvious prose). Different class — prose layout
  for a structured object is a taste decision — so deliberately kept out of the diff.
- `prompts.ts:552` extracts `c?.factions` but the generator writes `parties` → the model
  refines conflicts blind to who is fighting. Fails silently (prose still plausible).

**Disambiguation that prevents false positives:** top-level `settlement.factions` is a
DIFFERENT record type (NPC grouping list: `name`, `dominantCategory`, `powerFactionName`).
Sites reading `.name` off *that* are CORRECT and out of scope. Also `addFaction`
(mutateEntities.js:374-384) mints `{id, name, faction, ..., description}` — the only records
carrying `.name`, with prose under `.description` not `.desc`; a blurb accessor must serve
both (viewModel.js:509 already does).

**Pre-existing red, not caused by this work:** `tests/pdf/goldenViewModel.test.js` has 1
failing snapshot — reproduced on a pristine `dc0b6e2b` checkout with empty `git status`.
