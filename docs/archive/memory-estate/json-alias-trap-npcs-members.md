---
name: json-alias-trap-npcs-members
description: "⚠️ JSON-ALIAS TRAP: factions[].members[] holds the SAME objects as npcs[] in memory — mutations look healed on both until serialization splits the alias; reload-only bugs are invisible to in-memory tests. Always JSON-round-trip fixtures for rename/cascade/mutation tests."
metadata: 
  node_type: memory
  type: project
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T03:15:47.488Z
---

Found 2026-07-28 by the faction-rename must-fix lane (executed census, seed 'faction-rename-cascade-2026-07-27'): at generation, `factions[].members[]` entries ARE the `npcs[]` objects (same references). An in-memory rename of an NPC field appears to heal both collections; only `JSON.stringify`/parse (persist → reload) splits the alias, after which the members' copies go permanently stale. The faction-rename cascade bug existed EXCLUSIVELY on reloaded saves for exactly this reason.

**Why:** This is the read-side sibling of the owner's most-bitten class ("the write that survives one path and ghosts another") — an alias that heals in memory and splits on serialization. Any test exercising mutation of roster-linked data against a fresh in-memory pipeline output is structurally blind to the persisted-world behavior.

**How to apply:** Every rename/cascade/mutation test on settlement blobs must run against a JSON-ROUND-TRIPPED save (`JSON.parse(JSON.stringify(settlement))`), never the live pipeline object. The cure pattern (src/domain/factionRename.js since 2026-07-28): declare the shared field family ONCE and apply it at BOTH homes via a single writer, so the two collections cannot drift. Related: [[shared-index-commit-race]] for the concurrent-session context this surfaced in.
