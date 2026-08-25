---
name: institution-name-corpus-is-closed-and-enumerable
description: "⭐⭐ Institution names are NEVER templated — every one is a literal key of src/data/institutionalCatalog.js (276 unique over 6 tiers) and nativeSemanticName BLANKS custom content, so any regex over institution names can be designed against a CLOSED, ENUMERABLE set instead of guessed at"
metadata: 
  node_type: memory
  type: mechanism + design method
  created: 2026-08-11
  lane: Lane S — THE GOLDEN BATCH
  measured_at: e7774ff2 / landed b0912f7f
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-11T23:31:39.474Z
---

MEASURED 2026-08-11 while narrowing `FACTION_ROLES.noble`'s `linkToInst`. The single most
useful fact for anyone writing or auditing a pattern that matches institution names: **you
never have to guess what strings it will see.**

## The mechanism

- **One source.** `src/data/institutionalCatalog.js` (~2500 lines). Shape is
  `institutionalCatalog[tier][Category][Name] = {required, baseChance, desc, tags, …}` —
  the names are **object KEYS, not array elements**, and they are variously single-quoted,
  double-quoted (when the name holds an apostrophe), or **bare/unquoted** (`Courthouse:`).
  That quoting inconsistency is why you must enumerate at RUNTIME, not by grepping the file.
- **311 entries across 6 tiers → 276 unique name strings.**
- **`src/generators/data/` is EMPTY** and `src/generators/lookups.js` holds no data — it
  re-exports from `src/data/`. Do not go looking there.
- **Nothing is templated.** Every push site copies a catalog key verbatim
  (`assembleInstitutions.js`, `isolationGenerator.js`, `cascadePass.js`,
  `factionCorrelation.js`, `coherenceRepairPass.js`). Template literals near institutions
  build `desc`, never `name`.
- **Custom/DM content is BLANKED, not passed through.**
  `domain/content/customContentSemanticAuthority.js`'s `nativeSemanticName` is a provenance
  gate: it returns `''` for materialized custom content and `String(value.name || '')`
  otherwise. So the unbounded user-authored names never reach a pattern that reads through it.

**Empirical closure proof:** 1200 pipeline runs (6 tiers × 200 seeds, sweeping
tradeRouteAccess / monsterThreat / priorities) produced 263 unique names and
**ZERO outside the catalog**.

## How to apply

Enumerate at runtime and diff the old pattern against the new one — this turns "is my regex
right?" into an executed, complete answer:

```js
import { institutionalCatalog } from '<abs>/src/data/institutionalCatalog.js';
const names = new Set();
for (const tier of Object.values(institutionalCatalog))
  for (const cat of Object.values(tier))
    for (const n of Object.keys(cat)) names.add(n);
// then: OLD.test(n.toLowerCase()) vs NEW.test(n.toLowerCase()) over [...names]
// assert NEWLY-MATCHED === [] to prove a narrowing is a STRICT SUBSET
```

⭐ Because the corpus is closed, **an alternative that matches nothing in it is unfalsifiable
pattern surface** — the repo's censuses treat that as vacuity. Do not add speculative
spellings ('moot hall', 'village hall') "for the future". The repo's own idiom is the tight
literal: the merchant row already uses the qualified two-word `trade hall`.

⚠ **Regex traps in this corpus:** `\bcourt\b` MISSES `Courthouse` and `Multiple courthouses`
(the only compound-word cases). Casing is inconsistent — most names are sentence case but
`Druid Circle`, `Elder Grove Council`, `Warden's Lodge` are Title Case, so match
case-insensitively. `Ale house` (village) and `Alehouse` (hamlet) are BOTH live and distinct.
Names carry apostrophes, parens, slashes, `&amp;`, `+`, commas and hyphens.

⚠ **Two dead references:** `'Major port'` and `'Navy (if coastal)'` are matched in
`institutionProbability.js`, `structuralValidator.js` and `priorityHelpers.js` but exist
NOWHERE in the catalog and can never be produced.
