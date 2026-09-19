---
name: prominent-relationship-reader-repair
description: "⭐⭐ THE prominentRelationship EXPORT DEFECT IS REPAIRED READER-SIDE (edits landed unstaged 2026-08-10, HEAD 2a7fb033) — every export surface read SIX keys no writer ever produced, so the PDF callout rendered 'Neighbour · Linked' with NO BODY AT ALL and the Foundry journal rendered ' — Quiet Rivalry'. ⚠⚠ the record is an NPC-TO-NPC edge INSIDE the settlement, so `otherSettlement` was SEMANTICALLY INCOHERENT, never merely missing. Cure = ONE shared contract `prominentPair`/`prominentType`/`prominentProse` in pdf/lib/format.js, consumed by all three surfaces. ⚠⚠ `prominentProse` MUST prefer `phrasing` — it is a REGISTERED user-editable path, so preferring `full` silently drops the user's own edit from their export."
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T02:16:45.475Z
---

## The record, and why the readers were incoherent

`settlement.prominentRelationship` has exactly ONE writer, `genRelNarrative`
(`src/generators/power/settlementNarrative.js:205-235`), emitting exactly:

```
{ npc1, npc2, type, phrasing, full, tension }
```

It is an **NPC-to-NPC edge INSIDE the settlement** — `npc1`/`npc2` are canonical
roster names (pinned by `generationCertificationCorpus.test.js:259-270`), `type` is
the archetype's human LABEL (`topRel.typeName`, e.g. "Quiet Rivalry"), `full` is
`topRel.description`.

Every export reader instead reached for `otherSettlement`, `relationshipType`,
`description`, `summary`, `flavour`, `flavor`. ⚠⚠ `git log -S otherSettlement --
src/generators/` returns **nothing** — the token has never existed in generation, so
these were speculative from day one and no legacy save can carry them either (no
migration ever touched the key).

## MEASURED live output at 2a7fb033 (before)

- **PDF Relationships ch.**: `PROMINENT RELATIONSHIP` → `Neighbour · Linked` → page
  footer. **The body was ABSENT ENTIRELY** — `EditableProse` returns `null` when
  `defaultValue` is `''` and `hideIfEmpty` defaults true.
- **PDF Overview ch.**: `NOTABLE CONNECTION` → `Neighbour` → `Quiet Rivalry` → footer.
  No prose. (`type` alone worked, because Overview's pill already had a `|| .type`.)
- **Foundry journal**: `## Prominent relationship\n — Quiet Rivalry` — a leading
  em-dash over an empty name.

⚠ `phrasing` appeared **nowhere** in `src/pdf/` or `src/foundry/` — the exports were
missing the prose entirely, a bigger hole than the OSR triage recorded.

## The cure

ONE shared contract in `src/pdf/lib/format.js` (all three surfaces already imported
that module, so no new import edge): `prominentPair` → `"A & B"`, `prominentType` →
`cap(type)`, `prominentProse` → `phrasing || full || tension`.

- ⚠⚠ **`prominentProse` prefers `phrasing` deliberately.**
  `prominentRelationship.phrasing` is a REGISTERED user-editable prose path
  (`domain/userEdits.js:92`, `store/settlementPendingEdits.js:74`) and the key the AI
  refiner rewrites. Preferring `full` would silently drop a user's own wording.
- ⚠⚠ **Never `humanize()` an NPC name** — humanize splits at an inner capital, so
  "McTavish" renders "Mc Tavish". The old code humanized the title.
- `REL_LABELS` in Relationships.jsx is keyed by INTER-SETTLEMENT types
  (rival/cold_war/allied); it could never match an archetype label anyway.

## ⚠ The rename consequence (declared, not fixed)

`prominentRelationship.npc1/.npc2/.full/.tension/.phrasing` are ALL in
**`NPC_NON_CASCADED_SURFACES`** (`domain/factionRename.js:355-359`) — a user rename
deliberately does NOT rewrite them ("the record moves as a unit or not at all";
prose-about-people is owner-gated). The export now DISPLAYS npc1/npc2, so a renamed
NPC shows a stale name there. This is the SAME staleness `phrasing` already carried on
screen (OverviewTab/SummaryTab), now widened to the export — not a new class, but it
is a real consequence. The generation-time departed-name boundary DOES rewrite the
record (`departedNameProseBoundary.test.js:100-124`); only user renames do not.

## Pins

`tests/pdf/pdfParityFixes.test.js` — 4 pins, two-sided: the WRITER's exact six-key set
is frozen, and the READER contract is proved to return `''` for a record carrying ONLY
the six never-written keys (with the written shape as the positive anchor). All driven
as mutants, true exit 1 each: journalPages-at-base → `expected '## Prominent
relationship\n — Quiet R…' to contain 'Halda Brenn'`; `prominentProse` mutated to read
`description` first → `expected 'D' to be ''`; writer given a 7th key → key-set diff.

Related: [[osr-171-growth-rows-triaged]] · [[regen-edit-loss-hazard]].
