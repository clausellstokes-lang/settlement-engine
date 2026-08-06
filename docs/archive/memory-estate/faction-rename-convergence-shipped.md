---
name: faction-rename-convergence-shipped
description: "Owner queue #14 SHIPPED — the two divergent faction-rename lanes converged on one writer, the door built in the Entity Inspector, and the enumerated 15-surface cascade denominator."
metadata: 
  node_type: memory
  type: project
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T01:39:26.909Z
---

**WHAT SHIPPED (2026-07-27, worktree `minifold` on `claude/composite-r4`, UNCOMMITTED at
write time).** Owner queue #14 / atlas presentation-scene gaps 1 / 1b / 2 + power-faith gap 1.

**THE ONE WRITER: `src/domain/factionRename.js`.** A pure leaf holding
`FACTION_RENAME_SURFACES` (the enumerated cascade denominator, 15 entries),
`NON_CASCADED_SURFACES` (the ledger of deliberate refusals, each with a reason),
`applyFactionRenameToSettlement` (mutates a draft in place, for Immer + clones),
`factionRenameChanges` (immutable form returning only touched top-level buckets),
`applyFactionRenameToPartner` (the neighbour-link half) and `resolveFactionForRename`.
`renameInterSettlementReference` MOVED here from `src/components/settlements/helpers.js`,
which now re-exports it.

**⚠️ MEASURED: SEVEN surfaces hold the governing faction's name on real pipeline output**
(`generateSettlementPipeline`, city/germanic/grassland, seed `faction-rename-cascade-2026-07-27`):
`powerStructure.factions[].faction`, `powerStructure.governingName`, `powerStructure.government`,
`powerStructure.factionRelationships[].pair[]`, `npcs[].factionAffiliation`,
`factions[].powerFactionName`, `powerStructure.factionRelationships[].narrative`.
**The old store lane moved ONE of those seven; the old library lane moved NONE** (it wrote
`settlement.factions[].name`, which real generator output does not even populate with the power
faction's name). That measurement is the whole justification for the convergence and is pinned as
a floor in `tests/domain/factionRename.test.js`.

**DELIBERATE NON-CASCADES (do not "fix" these):**
- `powerStructure.previousGovernments[]` — regime lineage is recorded history.
- `powerStructure.factions[].id` — the durable identity `undoEvent` keys on (`createdByEventId`).
- `campaign.wizardNews.entries[]` — campaign state this writer never holds, AND a byte-identity
  golden surface (`pulseKernel.js` says so in-line): rewriting it would be a declared golden shift.
- 3D scene labels — derived per compile; `townScene/sceneSemantics.js` sets `factionRefs: []`,
  the schema carries no district-to-faction identity.
- `aiData` — cascaded by the registered `applyCosmeticRename` op instead, which both lanes call.

**SHAPE RULE:** the roster dual-write sets both `.faction` and `.name` only when the record
ALREADY declares them (`key in target`). Generator records carry `.faction` only; minting a
redundant `.name` would be a persistence-shape change. A divergent record (`.faction` renamed,
`.name` stale) DOES heal, because `nameOf` precedence makes `.faction` canonical.

**THE DOOR:** `src/components/dossier/WorkbenchFactionRename.jsx`, a lazy sub-leaf of the
Workbench Entity Inspector beside `WorkbenchProseEditor`. It writes nothing: it stages
`queueEdit('rename-faction', { factionIndex, newName })`. `'rename-faction'` left the declared-
scaffolding list and joined `COMMITTABLE_EDIT_KINDS` (EDIT_POLICY row
`['authoring','immediate','settlement.rename-faction']`, targetRef `faction:<index>` — the SAME
key `edit-prose` on a faction produces). Premium gate is the mount's `viewerCanAuthor`-derived
`readOnly`; desktop-only, matching the sibling authoring surfaces. The gallery door
(`SettlementDetailEditNames.jsx`) also now renders the CANONICAL roster through `nameOf` instead
of the empty legacy mirror — that was atlas gap 1c.

**⚠️ DELIBERATELY DEFERRED — UNDO IS SINGLE-SAVE.** The Change Dock's snapshot undo
(`revertToSnapshot`) reads ONE save's `versionHistory`. Neighbour saves the cascade rewrote keep
the NEW name after that undo; the compensating action is to rename back. Widening it needs a
cross-save snapshot = persistence-shape change = owner-gated. Not a regression: the library lane
cascaded to neighbours with NO undo at all. Recorded in `renameFactionImpl`'s header.

**Ratchets moved:** `renameFaction` left `tests/store/deadOperationRatchet.test.js`
`DEAD_OPERATIONS` (5 → 4) by becoming reachable; `operationRegistry` description rewritten from
the overstated "carries the new name through its references" to the specific list, then
`npm run gen:compendium-data`. `settlementSlice.js` shrank (the body moved to
`settlementRenameHelpers.renameFactionImpl`) and matches its frozen ceiling.

**Pins (42 + 15):** `tests/domain/factionRename.test.js` (denominator + totality + negative
controls), `tests/store/factionRenameConvergence.test.js` (store cascade, reload survival,
neighbour cascade, `applyCosmeticRename` handoff, canon lock, queue admission/commit/receipt/typed
refusals), `tests/components/workbenchFactionRename.test.jsx` (door + premium gate with positive
control), `tests/components/editNamesCanonicalFactions.test.jsx` (gallery roster + library-lane
`withFactionRenamed`).

## Why this matters
Faction display names are JOIN KEYS in at least eleven stored places. A rename that misses one
does not look wrong, it silently detaches NPCs from their faction and orphans the governing seat.
The denominator test is what makes "the cascade is complete" a measurement instead of a claim.

## How to apply
Before adding any new stored field that holds a faction display name, add it to
`FACTION_RENAME_SURFACES` with a probe in `tests/domain/factionRename.test.js`, or the rename
silently stops being total. Before "fixing" an apparent miss, read `NON_CASCADED_SURFACES` first.
